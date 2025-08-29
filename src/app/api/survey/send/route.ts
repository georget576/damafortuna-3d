import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { rating, feedback, suggestions, email } = await request.json()

    // Validate required fields
    if (!rating || !email) {
      return NextResponse.json(
        { error: 'Rating and email are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    let userEmailSent = false
    let adminEmailSent = false

    // Send user confirmation email
    if (email) {
      try {
        const userEmailResponse = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@damafortuna.com',
          to: email,
          subject: 'Thank you for your survey submission!',
          html: `
            <h1>Thank you for your feedback!</h1>
            <p>We appreciate you taking the time to complete our survey.</p>
            <p>Your rating: ${rating}/5</p>
            ${feedback ? `<p>Your feedback: ${feedback}</p>` : ''}
            ${suggestions ? `<p>Your suggestions: ${suggestions}</p>` : ''}
            <p>We'll use your feedback to improve our service.</p>
            <p>Best regards,<br>The DamaFortuna Team</p>
          `,
        })
        userEmailSent = true
      } catch (userEmailError) {
        console.error('Failed to send user email:', userEmailError)
        // Continue with admin email even if user email fails
      }
    }

    // Send admin notification email
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'george.t576@gmail.com'
      const adminEmailResponse = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@damafortuna.com',
        to: adminEmail,
        subject: `New Survey Submission - Rating: ${rating}/5`,
        html: `
          <h1>New Survey Submission</h1>
          <p><strong>Rating:</strong> ${rating}/5</p>
          ${email ? `<p><strong>User Email:</strong> ${email}</p>` : ''}
          ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
          ${suggestions ? `<p><strong>Suggestions:</strong> ${suggestions}</p>` : ''}
          <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
        `,
      })
      adminEmailSent = true
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError)
      throw adminEmailError // Re-throw admin email error as it's critical
    }

    // Log the final status
    console.log('Email sending summary:', {
      userEmailSent,
      adminEmailSent,
      rating,
      hasEmail: !!email,
      hasFeedback: !!feedback,
      hasSuggestions: !!suggestions
    })

    return NextResponse.json({
      message: 'Survey submitted successfully',
      userEmailSent,
      adminEmailSent
    })
  } catch (error) {
    console.error('Error processing survey submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}