'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Wallet as WalletIcon, History, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { useAccount } from 'wagmi'
import Transactions from '../components/Transactions'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from '../hooks/AuthContext'
import { toast } from 'react-hot-toast'

const DEFAULT_PROFILE = {
  username: 'ZenCue User',
  avatarURL: '/default-avatar.png',
  summary: 'A new ZenCue explorer ready to discover the world of AI assistance!'
}

export default function ProfilePage() {
  const [username, setUsername] = useState(DEFAULT_PROFILE.username)
  const [avatarURL, setAvatarURL] = useState(DEFAULT_PROFILE.avatarURL)
  const [summary, setSummary] = useState(DEFAULT_PROFILE.summary)
  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const { address } = useAccount()
  const { user } = useAuth()

  // Load data from localStorage on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return

      try {
        const profileRef = doc(db, 'profiles', user.uid)
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
          const data = profileSnap.data()
          setUsername(data.username)
          setAvatarURL(data.avatarURL)
          setSummary(data.summary)
          setNewName(data.username)
          setNewSummary(data.summary)
        } else {
          // Set default profile for new users
          await setDoc(profileRef, DEFAULT_PROFILE)
          setUsername(DEFAULT_PROFILE.username)
          setAvatarURL(DEFAULT_PROFILE.avatarURL)
          setSummary(DEFAULT_PROFILE.summary)
          setNewName(DEFAULT_PROFILE.username)
          setNewSummary(DEFAULT_PROFILE.summary)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  useEffect(() => {
    const scriptId = 'cloudinary-widget'
  
    // Avoid adding script multiple times
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
      script.async = true
      script.id = scriptId
      document.body.appendChild(script)
    }
  }, [])

  const handleCloudinaryUpload = () => {
    if (!window.cloudinary) {
      toast.error('Cloudinary widget not loaded yet')
      return
    }
  
    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dg3fyadhh',
        uploadPreset: 'avatar_preset',
        sources: ['local'],
        multiple: false,
        cropping: true,
        folder: 'avatars',
        resourceType: 'image',
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url
          setAvatarURL(imageUrl)
  
          const profileRef = doc(db, 'profiles', user.uid)
          await setDoc(profileRef, { avatarURL: imageUrl }, { merge: true })
  
          toast.success('Avatar updated successfully!')
        } else if (error) {
          console.error(error)
          toast.error('Image upload failed')
        }
      }
    )
  }



  const handleSaveProfile = async () => {
    if (!user?.uid) return

    try {
      const profileRef = doc(db, 'profiles', user.uid)
      await setDoc(profileRef, {
        username: newName,
        summary: newSummary
      }, { merge: true })

      setUsername(newName)
      setSummary(newSummary)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const getShortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'Not connected'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800">
      <Navigation />
      <main className="flex-1 container py-10 px-4 sm:px-6 lg:px-12 animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-6 mb-10">
              <Avatar className="h-28 w-28 ring-4 ring-blue-300 shadow-md">
                <AvatarImage src={avatarURL} />
                <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold tracking-tight">{username}</h1>
                <p className="mt-4 text-[15px] text-gray-700 max-w-lg">{summary}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:brightness-110 transition shadow-md">
                    <Pencil />Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Display Name</Label>
                      <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <button onClick={handleCloudinaryUpload} className="btn btn-primary">
                      Upload Profile Picture
                    </button>
                    <div>
                      <Label>Profile Summary</Label>
                      <Textarea
                        rows={4}
                        value={newSummary}
                        onChange={(e) => setNewSummary(e.target.value)}
                        placeholder="Write something about yourself..."
                      />
                    </div>
                    <Button onClick={handleSaveProfile}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="activity">
              <TabsList className="bg-white shadow-sm border rounded-lg grid grid-cols-2 w-full max-w-md mb-6">
                <TabsTrigger value="activity" className="rounded-l-md">Activity</TabsTrigger>
                <TabsTrigger value="wallet" className="rounded-r-md">Wallet</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="animate-slide-in-up">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
                      <History className="h-5 w-5" />
                      Website Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="font-medium">Visited “Explore Prompts”</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Edited profile</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Connected wallet</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet" className="animate-slide-in-up">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
                      <WalletIcon className="h-5 w-5" />
                      Wallet Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Connected Wallet</p>
                      <p className="font-mono text-blue-700">{getShortAddress(address)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Subscription Transactions</p>
                      <Transactions address={address || ''} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
