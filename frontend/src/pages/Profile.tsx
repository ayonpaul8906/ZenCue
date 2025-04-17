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

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [avatarURL, setAvatarURL] = useState('')
  const [summary, setSummary] = useState('')

  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const { address } = useAccount()

  // Load data from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem('username') || 'John.eth'
    const storedAvatar = localStorage.getItem('avatarURL') || '/placeholder.svg'
    const storedSummary = localStorage.getItem('summary') || 'A passionate Web3 enthusiast exploring the decentralized world!'

    setUsername(storedName)
    setAvatarURL(storedAvatar)
    setSummary(storedSummary)
    setNewName(storedName)
    setNewSummary(storedSummary)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setAvatarURL(imageURL)
      localStorage.setItem('avatarURL', imageURL)
    }
  }

  const handleSaveProfile = () => {
    setUsername(newName)
    setSummary(newSummary)
    localStorage.setItem('username', newName)
    localStorage.setItem('summary', newSummary)
  }

  const getShortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'Not connected'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800">
      <Navigation />
      <main className="flex-1 container py-10 px-4 sm:px-6 lg:px-12 animate-fade-in">
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
                  <div>
                    <Label>Upload Profile Picture</Label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                  </div>
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
      </main>
      <Footer />
    </div>
  )
}
