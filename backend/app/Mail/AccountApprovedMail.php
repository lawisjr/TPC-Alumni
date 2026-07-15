<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountApprovedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(protected User $user)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Alumni Account Has Been Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.account-approved',
            with: [
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
        );
    }
}
