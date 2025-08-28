import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { rating, feedback, suggestions, email } = await request.json()

    if (!rating || !feedback) {
      return NextResponse.json(
        { error: 'Rating and feedback are required' },
        { status: 400 }
      )
    }

    console.log('Survey submission received:', { rating, feedback: feedback.substring(0, 50), suggestions: suggestions?.substring(0, 50), email })

    // Email content
    const subject = 'DamaFortuna Survey Feedback'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6d28d9;">DamaFortuna Survey Feedback</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4c1d95;">Rating</h3>
          <div style="display: flex; gap: 5px;">
            ${Array.from({ length: 5 }, (_, i) => 
              `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: 24px;">★</span>`
            ).join('')}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4c1d95;">Feedback</h3>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${feedback}</p>
        </div>
        
        ${suggestions ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #4c1d95;">Suggestions</h3>
            <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${suggestions}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Thank you for your feedback! We appreciate your time and input.</p>
          <p>This email was sent from DamaFortuna.</p>
        </div>
      </div>
    `

    let userEmailSent = false
    let adminEmailSent = false

    // Send email to the user if they provided an email
    if (email) {
      try {
        console.log('Attempting to send user email to:', email)
        const userEmailResponse = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@damafortuna.com',
          to: email,
          subject: 'Thank you for your feedback - DamaFortuna',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #6d28d9;">Thank You for Your Feedback!</h2>
              
              <p style="font-size: 16px; line-height: 1.6;">
                We appreciate you taking the time to share your experience with DamaFortuna. 
                Your feedback helps us improve our service and create a better tarot reading experience for everyone.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 5px;">
                <h3 style="color: #4c1d95; margin-top: 0;">Your Rating</h3>
                <div style="display: flex; gap: 5px;">
                  ${Array.from({ length: 5 }, (_, i) => 
                    `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: 24px;">★</span>`
                  ).join('')}
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6;">
                We'll review your feedback carefully and use your suggestions to improve our service. 
                If you have any questions or need further assistance, please don't hesitate to reach out.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                <p>Best regards,<br>The DamaFortuna Team</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          `
        })
        console.log('User email sent successfully:', userEmailResponse)
        userEmailSent = true
      } catch (userEmailError) {
        console.error('Failed to send user email:', userEmailError)
        // Continue with admin email even if user email fails
      }
    }

    // Send email to admin with the survey results
    try {
      console.log('Attempting to send admin email to: george.t576@gmail.com')
      const adminEmailResponse = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@damafortuna.com',
        to: 'george.t576@gmail.com', // Replace with actual admin email
        subject: `New Survey Submission - Rating: ${rating}/5`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6d28d9;">New Survey Submission</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #4c1d95;">Rating</h3>
              <div style="display: flex; gap: 5px;">
                ${Array.from({ length: 5 }, (_, i) => 
                  `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: 24px;">★</span>`
                ).join('')}
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #4c1d95;">Feedback</h3>
              <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${feedback}</p>
            </div>
            
            ${suggestions ? `
              <div style="margin-bottom: 20px;">
                <h3 style="color: #4c1d95;">Suggestions</h3>
                <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${suggestions}</p>
              </div>
            ` : ''}
            
            ${email ? `
              <div style="margin-bottom: 20px;">
                <h3 style="color: #4c1d95;">User Email</h3>
                <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${email}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This survey was submitted on ${new Date().toLocaleString()}</p>
              <p>This email was sent from DamaFortuna.</p>
            </div>
          </div>
        `
      })
      console.log('Admin email sent successfully:', adminEmailResponse)
      adminEmailSent = true
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError)
      throw adminEmailError // Re-throw admin email error as it's critical
    }

    // Log the final status
    console.log('Email sending summary:', {
      userEmailSent,
      adminEmailSent,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        message: 'Survey submitted successfully',
        emailStatus: {
          user: userEmailSent ? 'sent' : 'not_sent',
          admin: adminEmailSent ? 'sent' : 'failed'
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing survey submission:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit survey',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}