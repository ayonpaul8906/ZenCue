'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Wallet as WalletIcon, History, Pencil, CheckCircle, XCircle, Activity, Cpu } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAccount } from 'wagmi';
import Transactions from '../components/Transactions';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { UserActivity, logActivity, ActivityTypes, cleanupOldActivities } from '../lib/activity';
import { getActiveSubscription } from '../lib/subscriptions'; // Import the function

const DEFAULT_PROFILE = {
  username: 'ZenCue User',
  avatarURL: '/default-avatar.png',
  summary: 'A new ZenCue explorer ready to discover the world of AI assistance!',
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

const slideInUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: 'easeInOut' },
};

const avatarHover = {
  scale: 1.08,
  rotate: [0, 5, -5, 0],
  transition: { duration: 0.3 },
};

const buttonHover = {
  scale: 1.05,
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  transition: { duration: 0.2 },
};

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeInOut', delay: 0.1 },
};

const listItemAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

// Helper function to check if a subscription is expired
const isSubscriptionExpired = (expiryDate: Timestamp | null | undefined): boolean => {
  if (!expiryDate) {
    return true; // Consider no expiry date as expired or inactive
  }
  const expiryTime = expiryDate.toDate().getTime();
  return Date.now() > expiryTime;
};

export default function ProfilePage() {
  const [username, setUsername] = useState(DEFAULT_PROFILE.username);
  const [avatarURL, setAvatarURL] = useState(DEFAULT_PROFILE.avatarURL);
  const [summary, setSummary] = useState(DEFAULT_PROFILE.summary);
  const [newName, setNewName] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState<any | null>(null); // State to hold active subscription data
  const [activities, setActivities] = useState<UserActivity[]>([]);


  const { address } = useAccount();
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const avatarControls = useAnimation();
  const [avatarRef, avatarInView] = useInView({ triggerOnce: true });

  const profileInfoControls = useAnimation();
  const [profileInfoRef, profileInfoInView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      navigate('/login'); // Replace '/login' with your actual login page path
    }
  }, [user, navigate]);

  useEffect(() => {
    if (avatarInView) {
      avatarControls.start({ scale: 1, rotate: 0 });
    }
  }, [avatarControls, avatarInView]);

  useEffect(() => {
    if (profileInfoInView) {
      profileInfoControls.start({ opacity: 1, y: 0 });
    }
  }, [profileInfoControls, profileInfoInView]);

  useEffect(() => {
    const loadProfileAndSubscription = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        // Load Profile
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setUsername(data.username);
          setAvatarURL(data.avatarURL);
          setSummary(data.summary);
          setNewName(data.username);
          setNewSummary(data.summary);
        } else {
          await setDoc(profileRef, DEFAULT_PROFILE);
          setUsername(DEFAULT_PROFILE.username);
          setAvatarURL(DEFAULT_PROFILE.avatarURL);
          setSummary(DEFAULT_PROFILE.summary);
          setNewName(DEFAULT_PROFILE.username);
          setNewSummary(DEFAULT_PROFILE.summary);
        }

        // Load Active Subscription
        const subscriptionData = await getActiveSubscription();
        setActiveSubscription(subscriptionData);

      } catch (error) {
        console.error('Error loading profile or subscription:', error);
        toast.error('Failed to load profile or subscription info');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndSubscription();
  }, [user, navigate]);

  useEffect(() => {
    const scriptId = 'cloudinary-widget';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  const handleCloudinaryUpload = () => {
    if (!window.cloudinary || !user?.uid) {
      toast.error('Please log in first');
      return;
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
          const imageUrl = result.info.secure_url;
          setAvatarURL(imageUrl);

          const profileRef = doc(db, 'profiles', user.uid);
          await setDoc(profileRef, { avatarURL: imageUrl }, { merge: true });

          toast.success('Avatar updated successfully!');
        } else if (error) {
          console.error(error);
          toast.error('Image upload failed');
        }
      }
    );
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, {
        username: newName,
        summary: newSummary,
      }, { merge: true });

      await logActivity(user.uid, {
        type: ActivityTypes.PROFILE_UPDATE,
        action: 'Updated profile details',
        details: 'Changed profile information'
      });

      setUsername(newName);
      setSummary(newSummary);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    const activitiesRef = collection(db, 'users', user.uid, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const newActivities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        })) as UserActivity[];
        setActivities(newActivities);
    });

    // Add cleanup of old activities
    cleanupOldActivities(user.uid);

    return () => unsubscribe();
}, [user?.uid]);

  const renderActivity = (activity: UserActivity) => {
    let icon;
    switch (activity.type) {
      case ActivityTypes.PROFILE_UPDATE:
        icon = <Pencil className="h-5 w-5 text-blue-400" />;
        break;
      case ActivityTypes.PAGE_VISIT:
        icon = <History className="h-5 w-5 text-green-400" />;
        break;
      case ActivityTypes.FEATURE_USE:
        icon = <Cpu className="h-5 w-5 text-purple-400" />;
        break;
      default:
        icon = <Activity className="h-5 w-5 text-gray-400" />;
    }

    return (
      <motion.div
        key={activity.id}
        variants={listItemAnimation}
        className="border-b border-gray-700 pb-3"
      >
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
            {activity.details && (
              <p className="text-sm text-gray-400">{activity.details}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const getShortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'Not connected';

  return (
    <div>
      <Navigation />
      <motion.div
        className="min-h-screen flex flex-col bg-gray-900 text-white font-sans"
        {...fadeIn}
      >
        <main className="flex-1 container py-12 px-6 sm:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Header Card with In-View Animation */}
            <motion.div
              ref={profileInfoRef}
              initial="initial"
              animate={profileInfoControls}
              variants={cardAnimation}
              className="bg-gray-800 shadow-lg rounded-xl p-8"
            >
              <div className="flex items-center gap-8">
                <motion.div
                  ref={avatarRef}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={avatarControls}
                  whileHover={avatarHover}
                >
                  <Avatar className="h-32 w-32 ring-4 ring-purple-500 shadow-xl">
                    <AvatarImage src={avatarURL} />
                    <AvatarFallback className="text-xl">{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight text-purple-400 mb-2">
                    {username}
                  </h1>
                  <p className="text-lg text-gray-300 max-w-lg">{summary}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div whileHover={buttonHover}>
                      <Button className="bg-purple-500 text-lg text-white hover:bg-purple-600 transition shadow-md">
                        <Pencil className="mr-2" size={20} />
                        Edit Profile
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white rounded-md p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-purple-400">
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label className="text-gray-300 text-lg">Display Name</Label>
                        <Input
                          className="bg-gray-700 text-lg text-white border-gray-600 focus:ring-purple-500 focus:border-purple-500 rounded-md"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </div>
                      <Button className="bg-teal-500 text-lg text-white hover:bg-teal-600 transition shadow-md rounded-md" onClick={handleCloudinaryUpload}>
                        Upload Profile Picture
                      </Button>
                      <div>
                        <Label className="text-gray-300 text-lg">Profile Summary</Label>
                        <Textarea
                          className="bg-gray-700 text-lg text-white border-gray-600 focus:ring-teal-500 focus:border-teal-500 rounded-md"
                          rows={4}
                          value={newSummary}
                          onChange={(e) => setNewSummary(e.target.value)}
                          placeholder="Write something about yourself..."
                        />
                      </div>
                      <Button className="bg-purple-500 text-lg text-white hover:bg-purple-600 transition shadow-md rounded-md" onClick={handleSaveProfile}>
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Tabs Section */}
            <motion.div variants={cardAnimation} className="opacity-100 translate-y-0">
              <Tabs defaultValue="activity">
                <TabsList className="bg-gray-800 shadow-md border border-gray-700 rounded-lg grid grid-cols-2 w-full max-w-md mb-6">
                  <TabsTrigger
                    value="activity"
                    className="rounded-l-md text-lg text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-purple-400"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="wallet"
                    className="rounded-r-md text-lg text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-purple-400"
                  >
                    Wallet
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="animate-slide-in-up">
                  <motion.div variants={slideInUp}>
                    <Card className="bg-gray-800 border border-gray-700 shadow-md rounded-md">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-teal-400">
                          <History className="h-6 w-6" />
                          Website Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-lg text-gray-300">
                        {activeSubscription ? (
                          isSubscriptionExpired(activeSubscription?.expiryDate) ? (
                            <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium">Subscription Expired:</p>
                                <p className="text-red-400">{activeSubscription.planTitle}</p>
                                <p className="text-sm text-gray-500">Expired on:{' '}
                                  {activeSubscription.expiryDate?.toDate().toLocaleDateString()}
                                </p>
                              </div>
                              <XCircle className="text-red-500 h-6 w-6" /> {/* Expired tag */}
                            </motion.div>
                          ) : (
                            <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium">Active Subscription:</p>
                                <p className="text-purple-300">{activeSubscription.planTitle}</p>
                                <p className="text-sm text-gray-500">Expires on:{' '}
                                  {activeSubscription.expiryDate?.toDate().toLocaleDateString()}
                                </p>
                              </div>
                              <CheckCircle className="text-green-500 h-6 w-6" /> {/* Active tag */}
                            </motion.div>
                          )
                        ) : (
                          <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3">
                            <p className="font-medium text-yellow-400 flex items-center gap-2">
                              <XCircle className="h-5 w-5" />
                              No active subscription
                            </p>
                            <p className="text-sm text-gray-500">Subscribe to unlock premium features!</p>
                          </motion.div>
                        )}

                        {activities.length > 0 ? (
                          activities.map(activity => renderActivity(activity))
                        ) : (
                          <p className="text-gray-500">No recent activity</p>
                        )}
                        {/* <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3">
                          <p className="font-medium">Visited “Explore Prompts”</p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </motion.div>
                        <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3" transition={{ delay: 0.1 }}>
                          <p className="font-medium">Edited profile</p>
                          <p className="text-sm text-gray-500">Yesterday</p>
                        </motion.div>
                        <motion.div variants={listItemAnimation} className="border-b border-gray-700 pb-3" transition={{ delay: 0.2 }}>
                          <p className="font-medium">Connected wallet</p>
                          <p className="text-sm text-gray-500">2 days ago</p>
                        </motion.div> */}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="wallet" className="animate-slide-in-up">
                  <motion.div variants={slideInUp}>
                    <Card className="bg-gray-800 border border-gray-700 shadow-md rounded-md">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-400">
                          <WalletIcon className="h-6 w-6" />
                          Wallet Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 text-lg text-gray-300">
                        <motion.div variants={listItemAnimation}>
                          <p className="text-sm text-gray-500">Connected Wallet</p>
                          <p className="font-mono text-purple-300 text-lg">{getShortAddress(address)}</p>
                        </motion.div>
                        <motion.div variants={listItemAnimation} transition={{ delay: 0.1 }}>
                          <p className="text-sm text-gray-500 mb-2">Subscription Transactions</p>
                          <Transactions address={address || ''} />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
      </motion.div>
      <Footer />
    </div>
  );
}