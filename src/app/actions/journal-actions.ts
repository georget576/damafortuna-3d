'use server'

import { JournalEntry, JournalEntriesResponse } from "../api/journal-entries/route"

export async function getJournalEntriesServerAction(
  userId?: string,
  userEmail?: string,
  page: number = 1,
  limit: number = 10
): Promise<JournalEntriesResponse> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (userEmail) params.append('userEmail', userEmail)
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    const response = await fetch(`${baseUrl}/api/journal-entries?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request for authentication
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch journal entries')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    throw new Error(`Failed to fetch journal entries: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getJournalEntryBySlugServerAction(
  slug: string,
  userId?: string
): Promise<JournalEntry | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    
    const response = await fetch(`${baseUrl}/api/journal-entries/slug/${slug}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch journal entry')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching journal entry by slug:', error)
    throw new Error(`Failed to fetch journal entry: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getJournalEntryByIdServerAction(
  id: string,
  userId?: string
): Promise<JournalEntry | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    
    const response = await fetch(`${baseUrl}/api/journal-entries/${id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch journal entry')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching journal entry by ID:', error)
    throw new Error(`Failed to fetch journal entry: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}