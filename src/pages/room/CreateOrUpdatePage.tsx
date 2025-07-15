'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreateRoomServiceRepeaterForm from './CreateRoomServiceRepeaterForm';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/ToastContext';
import axiosInstance from '@/configs/axios';
import { useNavigate } from 'react-router-dom';
import { RoomServiceProvider, useRoomService } from '@/contexts/RoomServiceContext';
import useSWR, { mutate } from 'swr';
import { get } from '@/lib/axiosIntanceHelp';

// Define a more flexible schema that matches the actual form fields
const formSchema = z.object({
  title: z.string().min(1, 'Room title is required'),
  desc: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  status: z.string().min(1, 'Status is required'),
  images: z.string().optional(),
  building_id: z.string().optional(),
});
type buildingsDataOption = {
  label: string;
  value: string;
};
// Create a wrapper component that uses the context
const RoomFormContent = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [uploadedImages, setUploadedImages] = useState<{
    [key: string]: string[];
  }>({});
  const { notify } = useToast();
  const navigate = useNavigate();
  const { services } = useRoomService();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      desc: '',
      price: '',
      status: 'available',
      images: '',
      building_id: '',
    },
  });

  const {
    data: rawDataBuildings,
    error,
    isLoading,
    mutate,
  } = useSWR('/admin/buildings?limit=100&page=1', get);

  const buildingsData: buildingsDataOption[] = useMemo(() => {
    if (!isLoading && rawDataBuildings && rawDataBuildings.data.length > 0) {
      return rawDataBuildings.data.map((item: any) => ({
        label: item.address,
        value: item.id.toString(),
      }));
    }
    return [
      {
        label: 'HAHA',
        value: 2,
      },
    ];
  }, [rawDataBuildings, isLoading]);

  const ImageDropzone = ({ fieldKey, multiple }: { fieldKey: string; multiple: boolean }) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:8083/';

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        try {
          const uploadPromises = acceptedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(url + 'admin/image', {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to upload image');
            }

            const data = await response.json();
            return data.data.url;
          });

          const urls = await Promise.all(uploadPromises);

          setUploadedImages((prev) => ({
            ...prev,
            [fieldKey]: multiple ? [...(prev[fieldKey] || []), ...urls] : [urls[0]],
          }));

          // Update the form value with the image URLs
          const imageUrls = multiple
            ? [...(uploadedImages[fieldKey] || []), ...urls].join(',')
            : urls[0];

          form.setValue(fieldKey as any, imageUrls);
        } catch (error) {
          console.error('Error uploading images:', error);
          notify('Failed to upload images. Please try again.', {
            type: 'error',
          });
        }
      },
      [fieldKey, multiple, token, form]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple,
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag & drop {multiple ? 'some' : 'an'} image
            {multiple ? 's' : ''} here, or click to select
          </p>
        )}
        <Upload className="mx-auto mt-2" />
      </div>
    );
  };

  const ImagePreview = ({ fieldKey }: { fieldKey: string }) => {
    const images = uploadedImages[fieldKey] || [];

    // If form has a value but uploadedImages doesn't, initialize from form
    const formValue = form.watch(fieldKey as any);
    if (formValue && typeof formValue === 'string' && formValue.length > 0 && images.length === 0) {
      const urls = formValue.split(',');
      if (urls.length > 0) {
        setUploadedImages((prev) => ({
          ...prev,
          [fieldKey]: urls,
        }));
      }
    }

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {images.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url || '/placeholder.svg'}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
              className="object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                const newImages = uploadedImages[fieldKey].filter((_, i) => i !== index);
                setUploadedImages((prev) => ({
                  ...prev,
                  [fieldKey]: newImages,
                }));

                // Update form value when removing an image
                form.setValue(fieldKey as any, newImages.join(','));
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Prepare the data for submission, including services from context
      const roomData = {
        title: values.title,
        description: values.desc,
        price: values.price,
        status: values.status,
        images: values.images,
        building_id: values.building_id,
        services: services, // Include services from context
      };

      console.log('Submitting room data:', roomData);

      // Make the API call to create the room
      const response = await axiosInstance.post('/admin/rooms', roomData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        notify('Room created successfully!', { type: 'success' });
        navigate('/admin/rooms'); // Redirect to rooms list
      } else {
        throw new Error('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      notify('Failed to create room. Please check your inputs and try again.', { type: 'error' });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room title</FormLabel>
                  <FormControl>
                    <Input placeholder="Room title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor defaultValue="" onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <>
                      <ImageDropzone fieldKey="images" multiple={true} />
                      <ImagePreview fieldKey="images" />
                      <input
                        type="hidden"
                        {...field}
                        value={uploadedImages['images']?.join(',') || ''}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Building</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="building_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Building</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select building" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingsData.map((building, index) => (
                          <SelectItem key={index} value={building.value}>
                            {building.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <CreateRoomServiceRepeaterForm />

        <div className="col-span-full">
          <Button type="submit" className="w-full md:w-auto">
            Create Room
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Main component that wraps the form with the context provider
export default function CreateOrUpdateRoom() {
  return (
    <RoomServiceProvider>
      <RoomFormContent />
    </RoomServiceProvider>
  );
}
