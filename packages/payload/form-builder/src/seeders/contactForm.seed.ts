import {
  defineSeed,
  ref,
} from '@wisemen/payload-core-seeder'

export const CONTACT_FORM_SEED_KEY = 'contact'

/** A practical first form for new projects; customise labels and routing per project. */
export const contactFormSeed: ReturnType<typeof defineSeed> = defineSeed('forms', () => [
  {
    title: {
      en: 'Contact us',
      nl: 'Neem contact op',
    },
    _key: CONTACT_FORM_SEED_KEY,
    _status: 'published',
    confirmation: {
      submitLabel: {
        en: 'Send message',
        nl: 'Verstuur bericht',
      },
      successMessage: {
        en: 'Thank you for your message. We will get back to you shortly.',
        nl: 'Bedankt voor je bericht. We nemen snel contact met je op.',
      },
    },
    description: {
      en: 'A standard contact form for website enquiries.',
      nl: 'Een standaard contactformulier voor vragen via de website.',
    },
    fields: [
      {
        name: 'firstName',
        blockType: 'text',
        helpText: {
          en: 'How should we address you?',
          nl: 'Hoe mogen we je aanspreken?',
        },
        label: {
          en: 'First name',
          nl: 'Voornaam',
        },
        placeholder: {
          en: 'Ada',
          nl: 'Ada',
        },
        required: true,
        width: 'half',
      },
      {
        name: 'lastName',
        blockType: 'text',
        label: {
          en: 'Last name',
          nl: 'Achternaam',
        },
        placeholder: {
          en: 'Lovelace',
          nl: 'Lovelace',
        },
        required: true,
        width: 'half',
      },
      {
        name: 'email',
        blockType: 'email',
        label: {
          en: 'Email address',
          nl: 'E-mailadres',
        },
        placeholder: {
          en: 'ada@example.com',
          nl: 'ada@voorbeeld.be',
        },
        required: true,
        width: 'half',
      },
      {
        name: 'phone',
        blockType: 'text',
        label: {
          en: 'Phone number',
          nl: 'Telefoonnummer',
        },
        placeholder: {
          en: '+32 470 00 00 00',
          nl: '+32 470 00 00 00',
        },
        required: false,
        width: 'half',
      },
      {
        name: 'topic',
        blockType: 'select',
        label: {
          en: 'What can we help with?',
          nl: 'Waarmee kunnen we helpen?',
        },
        options: [
          {
            label: {
              en: 'General question',
              nl: 'Algemene vraag',
            },
            value: 'general',
          },
          {
            label: {
              en: 'Request a quote',
              nl: 'Offerte aanvragen',
            },
            value: 'quote',
          },
          {
            label: {
              en: 'Support',
              nl: 'Ondersteuning',
            },
            value: 'support',
          },
        ],
        placeholder: {
          en: 'Choose a topic',
          nl: 'Kies een onderwerp',
        },
        required: true,
        width: 'full',
      },
      {
        name: 'message',
        blockType: 'textarea',
        label: {
          en: 'Your message',
          nl: 'Je bericht',
        },
        placeholder: {
          en: 'Tell us a little about your question.',
          nl: 'Vertel ons wat meer over je vraag.',
        },
        required: true,
        width: 'full',
      },
      {
        name: 'privacyAccepted',
        blockType: 'checkbox',
        helpText: {
          en: 'I agree that my details may be used to answer this enquiry.',
          nl: 'Ik ga ermee akkoord dat mijn gegevens gebruikt worden om deze vraag te beantwoorden.',
        },
        label: {
          en: 'Privacy policy',
          nl: 'Privacybeleid',
        },
        required: true,
        width: 'full',
      },
    ],
    slug: 'contact',
  },
])

export function getContactFormSeedRef() {
  return ref('forms', CONTACT_FORM_SEED_KEY)
}
