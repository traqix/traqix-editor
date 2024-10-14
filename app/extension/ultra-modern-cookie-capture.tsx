"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Share2, Cookie } from "lucide-react"

const goldenRatio = 1.618

export default function UltraModernCookieCapture() {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const [cookieData, setCookieData] = useState(null)

  const fetchCookie = async() => {
    setIsLoading(true)
    setCookieData(null)

    await searchProfiles("joao turazzi", "AQEDAQvK5YgADRWLAAABkn2_rXAAAAGSocwxcE0AdBthf43Isf8ERftgpAsJV9W4MT04oa9Bty")

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
      setCookieData({
        name: "session_id",
        value: "a1b2c3d4e5f6g7h8i9j0",
        domain: ".example.com",
        expires: new Date(Date.now() + 86400000).toISOString()
      })
    }, 2000)
  }

  const shareCookie = () => {
    // Implement share functionality here
    console.log("Sharing cookie:", cookieData)
  }

  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    return () => {
      document.body.style.background = ""
    }
  }, [])

  async function searchProfiles(searchTerm: string, liAtCookie: string) {
    const url = `https://www.linkedin.com/voyager/api/search/blended?keywords=${searchTerm}&count=10`;
  
    const headers = {
      'Csrf-Token': 'ajax:4300888134174820878',
      'Content-Type': 'application/json',
      'Cookie': `li_at=AQEDAQvK5YgDclTPAAABknwPlP0AAAGSoBwY_U0Alf2AOD2XQkaS9hL_CSFhcqe3VRV5GKy5YHC4X0Tz_4JQBuMuVdZy-AsRvQ2QydCj_g_skOhtRI0VK9wyrZTVArp5Hit7jYjJEGqFmsusrAu3AlWK`,
    };
  
    const response = await fetch(url, { headers: headers });
    const aaaaa = await response.json()
    console.log('AAAAA', aaaaa)
    return aaaaa;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Cookie Capture</h2>
            <p className="text-gray-600">Secure and elegant token management</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button
              onClick={fetchCookie}
              disabled={isLoading}
              className={`w-full h-${Math.round(16 * goldenRatio)}px bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Cookie className="w-5 h-5 mr-2" />
                  Fetch Cookie
                </>
              )}
            </Button>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </motion.div>

          <AnimatePresence>
            {cookieData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-xl p-4 shadow-inner"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cookie Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {cookieData.name}</p>
                  <p><span className="font-medium">Value:</span> {cookieData.value}</p>
                  <p><span className="font-medium">Domain:</span> {cookieData.domain}</p>
                  <p><span className="font-medium">Expires:</span> {new Date(cookieData.expires).toLocaleString()}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter system token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={shareCookie}
                disabled={!cookieData || !token}
                className={`w-full h-12 ${
                  cookieData && token
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gray-300"
                } text-white rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center space-x-2`}
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}