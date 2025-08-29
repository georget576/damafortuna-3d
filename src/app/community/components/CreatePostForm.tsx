import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
}

interface CreatePostFormProps {
  showCreateForm: boolean
  setShowCreateForm: (show: boolean) => void
  categories: ForumCategory[]
  newPost: {
    title: string
    content: string
    categoryId: string
    type: string
  }
  setNewPost: (post: {
    title: string
    content: string
    categoryId: string
    type: string
  }) => void
  handleCreatePost: (e: React.FormEvent) => void
}

export default function CreatePostForm({
  showCreateForm,
  setShowCreateForm,
  categories,
  newPost,
  setNewPost,
  handleCreatePost
}: CreatePostFormProps) {
  if (!showCreateForm) return null

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="font-caveat-brush text-xl text-purple-300">Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Title</label>
            <Input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="bg-gray-900/50 border-gray-600 text-white font-just-another-hand tracking-widest text-2xl"
              placeholder="Enter post title..."
            />
          </div>
          
          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Category</label>
            <div className="space-y-2">
              <select
                value={newPost.categoryId}
                onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                className="w-full bg-gray-900/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-xl"
              >
                <option value="">Select a category</option>
                
                {/* Core Tarot Categories */}
                <option disabled className="font-bold text-purple-300">── 🔮 Core Tarot Categories ──</option>
                {(() => {
                  const coreCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🔮') ||
                      cat.name.includes('Daily') ||
                      cat.name.includes('Weekly') ||
                      cat.name.includes('Moon') ||
                      cat.name.includes('Major') ||
                      cat.name.includes('Minor') ||
                      cat.name.includes('Court') ||
                      cat.name.includes('Spread')
                    )
                  );
                  return coreCategories.length > 0 ? (
                    coreCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Personal & Reflective Categories */}
                <option disabled className="font-bold text-blue-300">── 🧠 Personal & Reflective Categories ──</option>
                {(() => {
                  const personalCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🧠') ||
                      cat.name.includes('Intuitive') ||
                      cat.name.includes('Shadow') ||
                      cat.name.includes('Spiritual') ||
                      cat.name.includes('Emotional') ||
                      cat.name.includes('Synchronicities')
                    )
                  );
                  return personalCategories.length > 0 ? (
                    personalCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4 font-just-another-hand tracking-widest">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Journal Style Categories */}
                <option disabled className="font-bold text-green-300">── 📓 Journal Style Categories ──</option>
                {(() => {
                  const journalCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('📓') ||
                      cat.name.includes('Tarot') ||
                      cat.name.includes('Card') ||
                      cat.name.includes('Reading') ||
                      cat.name.includes('Lessons') ||
                      cat.name.includes('Symbols')
                    )
                  );
                  return journalCategories.length > 0 ? (
                    journalCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Occult & Esoteric Categories */}
                <option disabled className="font-bold text-yellow-300">── 🌙 Occult & Esoteric Categories ──</option>
                {(() => {
                  const occultCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🌙') ||
                      cat.name.includes('Astro') ||
                      cat.name.includes('Numerology') ||
                      cat.name.includes('Elemental') ||
                      cat.name.includes('Ritual')
                    )
                  );
                  return occultCategories.length > 0 ? (
                    occultCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Fallback: Show all categories if no grouping matches */}
                {(() => {
                  const hasGroupedCategories =
                    categories.some(cat => cat.name.includes('🔮') || cat.name.includes('🧠') || cat.name.includes('📓') || cat.name.includes('🌙')) ||
                    categories.some(cat => cat.name.includes('Daily') || cat.name.includes('Weekly') || cat.name.includes('Moon') || cat.name.includes('Major') || cat.name.includes('Minor') || cat.name.includes('Court') || cat.name.includes('Spread')) ||
                    categories.some(cat => cat.name.includes('Intuitive') || cat.name.includes('Shadow') || cat.name.includes('Spiritual') || cat.name.includes('Emotional') || cat.name.includes('Synchronicities')) ||
                    categories.some(cat => cat.name.includes('Tarot') || cat.name.includes('Card') || cat.name.includes('Reading') || cat.name.includes('Lessons') || cat.name.includes('Symbols')) ||
                    categories.some(cat => cat.name.includes('Astro') || cat.name.includes('Numerology') || cat.name.includes('Elemental') || cat.name.includes('Ritual'));
                  
                  if (!hasGroupedCategories) {
                    return (
                      <>
                        <option disabled className="font-bold text-gray-400">── All Categories ──</option>
                        {categories
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                            <option key={category.id} value={category.id} className="pl-4">
                              {category.name}
                            </option>
                          ))}
                      </>
                    );
                  }
                  return null;
                })()}
              </select>
              {newPost.categoryId && (
                <div className="text-sm text-gray-400">
                  Selected category: <span className="text-white font-medium italic">
                    {categories.find(c => c.id === newPost.categoryId)?.name || 'Unknown Category'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 italic">
                    ({categories.find(c => c.id === newPost.categoryId)?.description})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Post Type</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              className="w-full bg-gray-900/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-xl"
            >
              <option value="DAILY_DRAW_REFLECTION">Daily Draw Reflection</option>
              <option value="SPREAD_BREAKDOWN">Spread Breakdown</option>
              <option value="CARD_STUDY">Card Study</option>
              <option value="INTUITIVE_MESSAGE">Intuitive Message</option>
              <option value="TAROT_LIFE_EVENT">Tarot & Life Event</option>
              <option value="DECK_REVIEW_COMPARISON">Deck Review or Comparison</option>
              <option value="THEME_BASED_READING">Theme-Based Reading</option>
              <option value="TAROT_PROMPT_RESPONSE">Tarot Prompt Response</option>
              <option value="SYMBOL_ARCHETYPE_EXPLORATION">Symbol & Archetype Exploration</option>
              <option value="MONTHLY_RECAP">Monthly Recap</option>
            </select>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Content</label>
            <Textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="min-h-[200px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light tracking-widest text-xl"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
            >
              Create Post
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="border-gray-600 font-caveat-brush"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}