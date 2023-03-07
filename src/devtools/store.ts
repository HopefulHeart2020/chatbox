import { useState, useEffect } from 'react'
import { Settings, createSession, Session, Message } from './types'

// ipc

export const writeStore = (key: string, value: any) => {
    return (window as any).api.invoke('setStoreValue', key, value)
}
export const readStore = (key: string) => {
    return (window as any).api.invoke('getStoreValue', key)
}

// setting store

export function getDefaultSettings(): Settings {
    return {
        openaiKey: '',
    }
}

export async function readSettings(): Promise<Settings> {
    const setting = await readStore('settings')
    return setting || getDefaultSettings()
}

export async function writeSettings(settings: Settings) {
    return writeStore('settings', settings)
}

// session store

export async function readSessions(): Promise<Session[]> {
    let sessions = await readStore('chat-sessions')
    if (!sessions) {
        return [createSession()]
    }
    if (sessions.length === 0) {
        return [createSession()]
    }
    return sessions
}

export async function writeSessions(sessions: Session[]) {
    return writeStore('chat-sessions', sessions)
}

// react hook

export default function useStore() {
    const [settings, _setSettings] = useState<Settings>(getDefaultSettings())
    useEffect(() => {
        readSettings().then(_setSettings)
    }, [])
    const setSettings = (settings: Settings) => {
        _setSettings(settings)
        writeSettings(settings)
    }

    const [chatSessions, _setChatSessions] = useState<Session[]>([createSession()])
    const [currentSession, switchCurrentSession] = useState<Session>(chatSessions[0])
    useEffect(() => {
        readSessions().then((sessions: Session[]) => {
            _setChatSessions(sessions)
            switchCurrentSession(sessions[0])
        })
    }, [])
    const setSessions = (sessions: Session[]) => {
        _setChatSessions(sessions)
        writeSessions(sessions)
    }

    const deleteChatSession = (target: Session) => {
        const sessions = chatSessions.filter((s) => s.id !== target.id)
        if (sessions.length === 0) {
            sessions.push(createSession())
        }
        if (target.id === currentSession.id) {
            switchCurrentSession(sessions[0])
        }
        setSessions(sessions)
    }
    const updateChatSession = (session: Session) => {
        const sessions = chatSessions.map((s) => {
            if (s.id === session.id) {
                return session
            }
            return s
        })
        setSessions(sessions)
        if (session.id === currentSession.id) {
            switchCurrentSession(session)
        }
    }
    const createChatSession = (session: Session, ix?: number) => {
        const sessions = [...chatSessions, session]
        setSessions(sessions)
        switchCurrentSession(session)
    }
    const createEmptyChatSession = () => {
        createChatSession(createSession())
    }

    const setMessages = (session: Session, messages: Message[]) => {
        updateChatSession({
            ...session,
            messages,
        })
    }

    return {
        settings,
        setSettings,

        chatSessions,
        createChatSession,
        updateChatSession,
        deleteChatSession,
        createEmptyChatSession,

        currentSession,
        switchCurrentSession,
    }
}