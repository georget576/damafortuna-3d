"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Heart, Star, MessageSquare, Send, Home } from 'lucide-react'
import { toast } from 'sonner'

interface SurveyResponse {
  rating: number
  feedback: string
  suggestions: string
  email: string
}

export default function SurveyPage() {
  const [responses, setResponses] = useState<SurveyResponse>({
    rating: 0,
    feedback: '',
    suggestions: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleRatingClick = (rating: number) => {
    setResponses({ ...responses, rating })
  }

  const handleSubmit = async () => {
    if (responses.rating === 0) {
      toast.error('Please provide a rating')
      return
    }

    if (responses.feedback.trim() === '') {
      toast.error('Please provide your feedback')
      return
    }

    setIsSubmitting(true)
    try {
      // Send survey data to backend
      const response = await fetch('/api/survey/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }
      
      toast.success('Thank you for your feedback!')
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting survey:', error)
      toast.error('Failed to submit survey')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 font-caveat-brush">Thank You!</h1>
              <p className="text-xl text-gray-300 font-shadows-into-light">
                Your feedback has been received and is greatly appreciated.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8 font-shadows-into-light tracking-wide">
              <h2 className="text-xl font-semibold mb-4 font-caveat-brush text-purple-300">What happens next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300">We'll review your feedback carefully</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300">Use your suggestions to improve our service</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-gray-300">Continue to provide the best tarot experience</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 hover:bg-purple-700 font-caveat-brush text-lg px-8 py-3"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
              <MessageSquare className="h-12 w-12 text-purple-400 mx-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-caveat-brush text-purple-300">We'd Love Your Feedback</h1>
            <p className="text-xl text-gray-300 font-shadows-into-light">
              Help us improve by sharing your experience with DamaFortuna
            </p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="font-caveat-brush text-xl text-purple-100">User Experience Survey</CardTitle>
              <CardDescription className='font-just-another-hand tracking-widest text-xl text-purple-300'>
                Your feedback will help us create a better tarot reading experience for everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Rating Section */}
              <div>
                <label className="block text-lg font-medium mb-4 font-just-another-hand text-white tracking-widest">
                  How would you rate your overall experience?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        responses.rating >= star
                          ? 'bg-yellow-500/20 text-yellow-400 scale-110'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
                      }`}
                    >
                      <Star className={`h-6 w-6 ${responses.rating >= star ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2">
                  {responses.rating > 0 && (
                    <p className="text-sm text-gray-400">
                      {responses.rating === 1 && 'Poor'}
                      {responses.rating === 2 && 'Fair'}
                      {responses.rating === 3 && 'Good'}
                      {responses.rating === 4 && 'Very Good'}
                      {responses.rating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>
              </div>

              {/* Feedback Section */}
              <div>
                <label className="block text-lg font-medium mb-4 font-just-another-hand text-white tracking-widest">
                  What did you enjoy most about your experience?
                </label>
                <Textarea
                  value={responses.feedback}
                  onChange={(e) => setResponses({ ...responses, feedback: e.target.value })}
                  placeholder="Tell us about your favorite features, what worked well, or any positive experiences..."
                  className="min-h-[120px] bg-gray-900/50 border-gray-600 font-shadows-into-light text-purple-300"
                />
              </div>

              {/* Suggestions Section */}
              <div>
                <label className="block text-lg font-medium mb-4 font-just-another-hand text-white tracking-widest">
                  How can we improve?
                </label>
                <Textarea
                  value={responses.suggestions}
                  onChange={(e) => setResponses({ ...responses, suggestions: e.target.value })}
                  placeholder="What features would you like to see? Any suggestions for improvement?"
                  className="min-h-[120px] bg-gray-900/50 border-gray-600 font-shadows-into-light text-purple-300"
                />
              </div>

              {/* Email Section */}
              <div>
                <label className="block text-lg font-medium mb-4 font-just-another-hand text-white tracking-widest">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  value={responses.email}
                  onChange={(e) => setResponses({ ...responses, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-gray-900/50 border-gray-600 text-white font-just-another-hand tracking-widest"
                />
                <p className="text-base text-gray-400 mt-2 font-just-another-hand tracking-widest">
                  If you'd like us to follow up on your feedback, please provide your email.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 font-caveat-brush text-lg py-3"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-gray-400 font-just-another-hand tracking-widest">
            <p className="text-sm">
              Your responses are anonymous and will only be used to improve our service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}