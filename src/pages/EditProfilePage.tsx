import { useState, useEffect } from 'react';
import { Save, Loader2, User, Calendar, Globe, Palette, ArrowLeft, Server, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ImageUpload } from '../components/ui/ImageUpload';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { PageWrapper } from '../components/ui/PageWrapper';
import {
  FieldInput,
  FieldSelect,
  FieldMultiSelect,
  FieldRadio,
  FieldSwitch,
  FieldDatePicker,
  FieldTimePicker,
  FieldTitle,
} from '../components/ui/field-component';
import { useFormData } from '../hooks/useFormData';
import { ModeToggle } from '../components/ModeToggle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface EditProfileFormData {
  name: string;
  email: string;
  avatar?: File | null;
  birthDate: string;
  birthTime: string;
  country: string;
  hobbies: string[];
  gender: string;
  notifications: boolean;
  theme: string;
  subscribeNewsletter: boolean;
  initialBalance: string;
  profitPercentage: string;
  serverName: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface Hobby {
  id: string;
  name: string;
}

interface ProfileBody {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  country: string;
  hobbies: string[];
  gender: 'male' | 'female' | 'other';
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

const mockCountries: Country[] = [
  { id: '1', name: 'United States', code: 'US' },
  { id: '2', name: 'United Kingdom', code: 'UK' },
  { id: '3', name: 'Canada', code: 'CA' },
  { id: '4', name: 'Australia', code: 'AU' },
  { id: '5', name: 'Germany', code: 'DE' },
  { id: '6', name: 'France', code: 'FR' },
  { id: '7', name: 'Japan', code: 'JP' },
  { id: '8', name: 'Indonesia', code: 'ID' },
];

const mockHobbies: Hobby[] = [
  { id: '1', name: 'Reading' },
  { id: '2', name: 'Traveling' },
  { id: '3', name: 'Photography' },
  { id: '4', name: 'Cooking' },
  { id: '5', name: 'Gaming' },
  { id: '6', name: 'Music' },
  { id: '7', name: 'Fitness' },
  { id: '8', name: 'Coding' },
];

const countryOptions = mockCountries.map(c => ({
  label: c.name,
  value: c.id,
}));

const hobbyOptions = mockHobbies.map(h => ({
  label: h.name,
  value: h.id,
}));

export default function EditProfilePage() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialData: EditProfileFormData = {
    name: '',
    email: '',
    avatar: null,
    birthDate: '',
    birthTime: '',
    country: '',
    hobbies: [],
    gender: '',
    notifications: true,
    theme: 'system',
    subscribeNewsletter: false,
    initialBalance: '',
    profitPercentage: '',
    serverName: '',
  };

  const { formData, setData, setError, reset, setFieldValue } = useFormData<EditProfileFormData>(initialData);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          name: 'John Doe',
          email: 'john.doe@example.com',
          birthDate: '1990-05-15',
          birthTime: '09:30',
          country: '1',
          hobbies: ['1', '3', '8'],
          gender: 'male',
          notifications: true,
          theme: 'system',
          subscribeNewsletter: true,
          initialBalance: '1000000',
          profitPercentage: '10',
          serverName: 'Server-01',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!formData.data.name.trim()) {
        setError('name', 'Name is required');
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Name is required',
          position: 'top-right',
        });
        setIsSaving(false);
        return;
      }

      if (!formData.data.email.trim()) {
        setError('email', 'Email is required');
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Email is required',
          position: 'top-right',
        });
        setIsSaving(false);
        return;
      }

      const payload: ProfileBody = {
        name: formData.data.name,
        email: formData.data.email,
        birthDate: formData.data.birthDate,
        birthTime: formData.data.birthTime,
        country: formData.data.country,
        hobbies: formData.data.hobbies,
        gender: formData.data.gender as 'male' | 'female' | 'other',
        notifications: formData.data.notifications,
        theme: formData.data.theme as 'light' | 'dark' | 'system',
      };

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Profile saved:', payload);
      showToast({
        type: 'success',
        title: 'Profile Saved!',
        message: 'Your changes have been saved successfully.',
        position: 'top-right',
        duration: 5000,
      });
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('name', 'Failed to save profile. Please try again.');
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save profile. Please try again.',
        position: 'top-right',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to handle field changes
  const handleFieldChange = (field: keyof EditProfileFormData, value: string | string[] | boolean) => {
    setFieldValue(field, value as string);
    // Clear error when user starts typing
    if (formData.error[field]) {
      setError(field, undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <PageWrapper>
         <header className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
            <div className="flex items-center gap-3 sm:gap-4">
                <ModeToggle />
                <Button variant="outline" onClick={logout} className="justify-center p-2 sm:px-4">
                    <span className="hidden sm:inline">Sign Out</span>
                    <ArrowLeft className="h-4 w-4 sm:hidden rotate-180" />
                </Button>
            </div>
        </header>
        <Card className="relative border-0 shadow-lg ring-1 ring-zinc-950/5 dark:ring-white/10">
          <LoadingOverlay isLoading={isSaving} message="Saving..." />
          
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="p-1 h-auto hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">Edit Profile</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className={cn("space-y-6 sm:space-y-8", isSaving && "pointer-events-none")}>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="shrink-0">
                  <ImageUpload
                    value={formData.data.avatar ? URL.createObjectURL(formData.data.avatar) : undefined}
                    onChange={(file) => setData(prev => ({ ...prev, avatar: file }))}
                    placeholder="Upload avatar"
                    className="w-28 h-28 sm:w-32 sm:h-32"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-medium text-sm sm:text-base">Profile Photo</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Upload a new profile photo. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Direct Field Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Personal Information Section */}
                <FieldTitle
                  label="Personal Information"
                  colSpan={2}
                  icon={User}
                />
                <FieldInput
                  label="Full Name"
                  field="name"
                  value={formData.data.name}
                  onChange={(value) => handleFieldChange('name', value)}
                  error={formData.error.name}
                  required
                  colSpan={1}
                  props={{
                    type: 'text',
                    placeholder: 'Enter your full name',
                  }}
                />
                <FieldInput
                  label="Email Address"
                  field="email"
                  value={formData.data.email}
                  onChange={(value) => handleFieldChange('email', value)}
                  error={formData.error.email}
                  required
                  colSpan={1}
                  props={{
                    type: 'email',
                    placeholder: 'Enter your email',
                  }}
                />
                <FieldRadio
                  label="Gender"
                  value={formData.data.gender}
                  onChange={(value) => handleFieldChange('gender', value)}
                  error={formData.error.gender}
                  colSpan={2}
                  props={{
                    options: [
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other', value: 'other' },
                    ],
                    direction: 'horizontal',
                  }}
                />
                
                {/* Server & Financial Section */}
                <FieldTitle
                  label="Server & Financial"
                  colSpan={2}
                  icon={Server}
                />
                <FieldInput
                  label="Server Name"
                  field="serverName"
                  value={formData.data.serverName}
                  onChange={(value) => handleFieldChange('serverName', value)}
                  error={formData.error.serverName}
                  colSpan={1}
                  props={{
                    type: 'text',
                    placeholder: 'Enter server name',
                    icon: Server,
                    iconPosition: 'left',
                  }}
                />
                <FieldInput
                  label="Initial Balance"
                  field="initialBalance"
                  value={formData.data.initialBalance}
                  onChange={(value) => handleFieldChange('initialBalance', value)}
                  error={formData.error.initialBalance}
                  colSpan={1}
                  props={{
                    type: 'number',
                    prefix: 'Rp',
                    placeholder: '0',
                    icon: Wallet,
                    iconPosition: 'left',
                  }}
                />
                <FieldInput
                  label="Profit Percentage"
                  field="profitPercentage"
                  value={formData.data.profitPercentage}
                  onChange={(value) => handleFieldChange('profitPercentage', value)}
                  error={formData.error.profitPercentage}
                  colSpan={1}
                  props={{
                    type: 'number',
                    placeholder: '0',
                    suffix: '%',
                  }}
                />
                
                {/* Birthday Section */}
                <FieldTitle
                  label="Birthday"
                  colSpan={2}
                  icon={Calendar}
                />
                <FieldDatePicker
                  label="Date of Birth"
                  value={formData.data.birthDate}
                  onChange={(value) => handleFieldChange('birthDate', value)}
                  error={formData.error.birthDate}
                  colSpan={1}
                  props={{
                    placeholder: 'Select date',
                  }}
                />
                <FieldTimePicker
                  label="Birth Time"
                  value={formData.data.birthTime}
                  onChange={(value) => handleFieldChange('birthTime', value)}
                  error={formData.error.birthTime}
                  colSpan={1}
                  props={{
                    placeholder: 'Select time',
                    format: '12h',
                  }}
                />
                
                {/* Location & Interests Section */}
                <FieldTitle
                  label="Location & Interests"
                  colSpan={2}
                  icon={Globe}
                />
                <FieldSelect
                  label="Country"
                  value={formData.data.country}
                  onChange={(value) => handleFieldChange('country', value)}
                  error={formData.error.country}
                  colSpan={1}
                  props={{
                    options: countryOptions,
                    placeholder: 'Select country',
                    searchable: true,
                  }}
                />
                <FieldMultiSelect
                  label="Hobbies"
                  value={formData.data.hobbies}
                  onChange={(value) => handleFieldChange('hobbies', value)}
                  error={formData.error.hobbies}
                  colSpan={1}
                  props={{
                    options: hobbyOptions,
                    placeholder: 'Select hobbies',
                    searchable: true,
                    maxSelected: 5,
                  }}
                />
                
                {/* Preferences Section */}
                <FieldTitle
                  label="Preferences"
                  colSpan={2}
                  icon={Palette}
                />
                <FieldSelect
                  label="Theme"
                  value={formData.data.theme}
                  onChange={(value) => handleFieldChange('theme', value)}
                  error={formData.error.theme}
                  colSpan={1}
                  props={{
                    options: [
                      { label: 'Light', value: 'light' },
                      { label: 'Dark', value: 'dark' },
                      { label: 'System', value: 'system' },
                    ],
                    placeholder: 'Select theme',
                  }}
                />
                <FieldSwitch
                  label="Enable Notifications"
                  value={formData.data.notifications}
                  onChange={(checked) => handleFieldChange('notifications', checked)}
                  error={formData.error.notifications}
                  colSpan={1}
                  props={{
                    label: 'Enable notifications',
                  }}
                />
              </div>


              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
}
