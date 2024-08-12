import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const lastUserMessage = messages[messages.length - 1].content;

        const contextualMessage = `
            You are an AI-powered assistant specialized in Java Your expertise includes writing code, answering questions, and completing tasks related to these programming languages.
            Below is a user query:
            "${lastUserMessage}"
        `;

        const result = await chat.sendMessage(contextualMessage);
        const response = await result.response;
        const text = await response.text();

        // Return the AI's response
        return NextResponse.json({ content: text });

    } catch (error) {
        console.error('Error handling chat request:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    return NextResponse.json({ error: 'GET method not allowed' }, { status: 405 });
}

export async function HEAD(req) {
    return NextResponse.json({ error: 'HEAD method not allowed' }, { status: 405 });
}

export async function OPTIONS(req) {
    return NextResponse.json({ error: 'OPTIONS method not allowed' }, { status: 405 });
}

export async function PUT(req) {
    return NextResponse.json({ error: 'PUT method not allowed' }, { status: 405 });
}

export async function DELETE(req) {
    return NextResponse.json({ error: 'DELETE method not allowed' }, { status: 405 });
}

export async function PATCH(req) {
    return NextResponse.json({ error: 'PATCH method not allowed' }, { status: 405 });
}
