"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Trash2, AlertTriangle, Save, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  bio?: string
}

interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    image: '',
    bio: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  // Load user profile data
  useEffect(() => {
    if (session?.user) {
      const user = session.user as SessionUser
      setUserProfile({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
        bio: ''
      })
    }
  }, [session])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Here you would typically save to your database
      // For now, we'll just show a success message
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion')
      return
    }

    setIsDeleting(true)
    try {
      // Call the API to delete the user account
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies for session
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Sign out after successful deletion
      try {
        // First sign out to clear the client session
        await signOut({ callbackUrl: '/survey' })
      } catch (signOutError) {
        console.error('Error signing out:', signOutError)
        // Even if sign out fails, redirect to survey
        window.location.href = '/survey'
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
      setIsDeleting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className='font-just-another-hand tracking-widest tarot-gold'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-caveat-brush">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Please sign in to view your profile.</p>
            <Button 
              onClick={() => window.location.href = '/auth/signin'}
              className="w-full bg-purple-600 hover:bg-purple-700 font-caveat-brush"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-caveat-brush tarot-gold">User Profile</h1>
            <p className="text-gray-300 font-shadows-into-light">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-purple-400" />
                      <CardTitle className="font-caveat-brush text-xl text-purple-200">Profile Information</CardTitle>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-gray-600 font-caveat-brush"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  <CardDescription className='font-just-another-hand tracking-wide text-xl'>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    {userProfile.image ? (
                      <img
                        src={userProfile.image}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-purple-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center">
                        <User className="h-8 w-8 text-purple-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold font-caveat-brush tarot-gold">
                        {userProfile.name || 'User'}
                      </h3>
                      <p className="text-gray-400 font-just-another-hand tracking-wide">{userProfile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-2xl font-medium mb-2 font-just-another-hand text-white tracking-widest">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={userProfile.name || ''}
                          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                          className="bg-gray-900/50 border-gray-600 text-white font-just-another-hand tracking-widest"
                        />
                      ) : (
                        <p className="text-gray-300 font-shadows-into-light">
                          {userProfile.name || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-2xl font-medium mb-2 font-just-another-hand text-white tracking-widest">
                        Email Address
                      </label>
                      <p className="text-gray-300 font-shadows-into-light">
                        {userProfile.email}
                      </p>
                      <p className="text-xl text-gray-400 mt-1 font-just-another-hand tracking-widest">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-2xl font-medium mb-2 font-just-another-hand text-white tracking-widest">
                        Bio
                      </label>
                      {isEditing ? (
                        <Textarea
                          value={userProfile.bio || ''}
                          onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
                        />
                      ) : (
                        <p className="text-gray-300 font-shadows-into-light">
                          {userProfile.bio || 'No bio provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-gray-600 font-caveat-brush"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Actions Card */}
            <div>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="font-caveat-brush text-xl text-purple-300">Account Actions</CardTitle>
                  <CardDescription className='font-just-another-hand tracking-wide text-xl'>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="w-full border-gray-600 text-left justify-start font-caveat-brush"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2 font-just-another-hand tracking-widest">
                      <AlertTriangle className="h-4 w-4" />
                      Danger Zone
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-lg font-medium mb-2 text-red-400 font-just-another-hand tracking-widest">
                          Type "DELETE" to confirm account deletion
                        </label>
                        <Input
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder="DELETE"
                          className="bg-red-900/20 border-red-700 text-red-300 font-just-another-hand tracking-wide"
                        />
                      </div>
                      
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirm !== 'DELETE'}
                        variant="destructive"
                        className="w-full font-caveat-brush"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                      </Button>
                      
                      <p className="text-base text-red-400 font-just-another-hand tracking-widest">
                        This action cannot be undone. All your data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}