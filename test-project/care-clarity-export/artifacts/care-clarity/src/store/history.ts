import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Exchange {
  id: string;
  role: 'patient' | 'provider';
  original: string;
  translated: string;
  originalLang: string;
}

export interface Session {
  id: string;
  createdAt: string;
  exchanges: Exchange[];
}

interface HistoryState {
  sessions: Session[];
  loading: boolean;
  fetchSessions: () => Promise<void>;
  addSession: (exchanges: Omit<Exchange, 'id'>[]) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const loadLocalSessions = (): Session[] => {
  const stored = localStorage.getItem('careClarity_sessions');
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  return [];
};

const saveLocalSessions = (sessions: Session[]) => {
  localStorage.setItem('careClarity_sessions', JSON.stringify(sessions));
};

export const useHistory = create<HistoryState>((set, get) => ({
  sessions: loadLocalSessions(),
  loading: false,

  fetchSessions: async () => {
    if (!isSupabaseConfigured || !supabase) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return;
      }

      const sessions: Session[] = (data ?? []).map((row: { id: string; created_at: string; exchanges: Exchange[] }) => ({
        id: row.id,
        createdAt: row.created_at,
        exchanges: row.exchanges ?? [],
      }));

      saveLocalSessions(sessions);
      set({ sessions });
    } catch (e) {
      console.warn('Failed to fetch sessions from Supabase:', e);
    } finally {
      set({ loading: false });
    }
  },

  addSession: async (exchanges) => {
    if (exchanges.length === 0) return;

    const newSession: Session = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      exchanges: exchanges.map(e => ({ ...e, id: uuidv4() })),
    };

    const updated = [newSession, ...get().sessions];
    saveLocalSessions(updated);
    set({ sessions: updated });

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('sessions').insert({
        id: newSession.id,
        created_at: newSession.createdAt,
        exchanges: newSession.exchanges,
      });
      if (error) console.warn('Supabase insert error:', error.message);
    }
  },

  deleteSession: async (id) => {
    const updated = get().sessions.filter(s => s.id !== id);
    saveLocalSessions(updated);
    set({ sessions: updated });

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('sessions').delete().eq('id', id);
      if (error) console.warn('Supabase delete error:', error.message);
    }
  },

  clearHistory: async () => {
    localStorage.removeItem('careClarity_sessions');
    set({ sessions: [] });

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('sessions').delete().neq('id', '');
      if (error) console.warn('Supabase clear error:', error.message);
    }
  },
}));
