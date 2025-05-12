import { NextResponse } from 'next/server';

// Add your Pinata API keys to .env.local file
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export async function POST(request: Request) {
  try {
    // Only allow authenticated users with correct content type
    if (!request.headers.get('Content-Type')?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a new FormData for the Pinata API
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    // Add metadata for better organization in Pinata
    const metadata = JSON.stringify({
      name: `arda-drama-${Date.now()}`,
    });
    pinataFormData.append('pinataMetadata', metadata);

    // Set options for Pinata (optional)
    const options = JSON.stringify({
      cidVersion: 1,
    });
    pinataFormData.append('pinataOptions', options);

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
      },
      body: pinataFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Pinata upload error:', errorData);
      return NextResponse.json({ error: 'Failed to upload to IPFS' }, { status: 500 });
    }

    const data = await response.json();
    
    // Return the IPFS hash (CID)
    return NextResponse.json({ 
      success: true, 
      ipfsHash: data.IpfsHash,
      // Return gateway URLs for easy access
      ipfsUrl: `ipfs://${data.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
