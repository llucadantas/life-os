import { createFileRoute } from "@tanstack/react-router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard,
  ListChecks,
  Repeat,
  Check,
  Flame,
  Plus,
  Calendar,
  Sparkles,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Palette,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life OS — Seu sistema operacional pessoal" },
      {
        name: "description",
        content:
          "Dashboard pessoal para organizar prioridades, tarefas e hábitos em um só lugar.",
      },
      { property: "og:title", content: "Life OS — Seu sistema operacional pessoal" },
      {
        property: "og:description",
        content:
          "Dashboard pessoal para organizar prioridades, tarefas e hábitos em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LifeOSRoot,
});

// ---------- Types & Mock data ----------

type Priority = "Alta" | "Média" | "Baixa";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string;
  done: boolean;
}

interface Habit {
  id: string;
  name: string;
  motivation?: string;
  weeklyGoal: number;
  streak: number;
  doneToday: boolean;
}

interface UserProfile {
  name: string;
  email: string;
}

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Revisar rotas e endpoints da API REST", description: "Auditar contratos e status codes.", priority: "Alta", date: "2026-07-23", done: false },
  { id: "t2", title: "Treino de força (Costas/Bíceps)", priority: "Alta", date: "2026-07-23", done: false },
  { id: "t3", title: "Escrever documentação do módulo de auth", priority: "Média", date: "2026-07-23", done: false },
  { id: "t4", title: "Responder e-mails pendentes", priority: "Baixa", date: "2026-07-24", done: true },
  { id: "t5", title: "Planejar sprint da próxima semana", priority: "Média", date: "2026-07-25", done: false },
];

const INITIAL_HABITS: Habit[] = [
  { id: "h1", name: "Praticar piano (Jazz)", motivation: "Fluência harmônica.", weeklyGoal: 5, streak: 12, doneToday: true },
  { id: "h2", name: "Leitura (30min)", motivation: "Aprender continuamente.", weeklyGoal: 7, streak: 27, doneToday: false },
  { id: "h3", name: "Correr 5km", motivation: "Saúde cardiovascular.", weeklyGoal: 3, streak: 4, doneToday: false },
  { id: "h4", name: "Meditar", motivation: "Clareza mental.", weeklyGoal: 7, streak: 51, doneToday: true },
];

const DEFAULT_USER: UserProfile = { name: "Lucas Dantas", email: "lucas@email.com" };

// ---------- Theme ----------

type ThemeMode = "dark" | "light";

interface ThemeCtx {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  mode: "dark",
  setMode: () => {},
  toggle: () => {},
});

const useTheme = () => useContext(ThemeContext);

const THEME_VARS: Record<ThemeMode, Record<string, string>> = {
  dark: {
    "--app": "#09090b",
    "--card": "#18181b",
    "--card-2": "rgba(39,39,42,0.4)",
    "--text": "#f4f4f5",
    "--muted": "#a1a1aa",
    "--muted-2": "#71717a",
    "--border": "#27272a",
    "--border-2": "#3f3f46",
    "--hover": "rgba(39,39,42,0.6)",
    "--input-bg": "#09090b",
    "--accent": "#10b981",
    "--accent-hover": "#34d399",
    "--accent-fg": "#09090b",
    "--accent-soft": "rgba(16,185,129,0.1)",
    "--accent-border": "rgba(16,185,129,0.3)",
    "--accent-text": "#34d399",
  },
  light: {
    "--app": "#f9fafb",
    "--card": "#ffffff",
    "--card-2": "#f4f4f5",
    "--text": "#18181b",
    "--muted": "#52525b",
    "--muted-2": "#71717a",
    "--border": "#e4e4e7",
    "--border-2": "#d4d4d8",
    "--hover": "#f4f4f5",
    "--input-bg": "#ffffff",
    "--accent": "#ca8a04",
    "--accent-hover": "#eab308",
    "--accent-fg": "#ffffff",
    "--accent-soft": "rgba(202,138,4,0.12)",
    "--accent-border": "rgba(202,138,4,0.4)",
    "--accent-text": "#a16207",
  },
};

function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeos:theme") as ThemeMode | null;
      if (saved === "dark" || saved === "light") setModeState(saved);
    } catch {}
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem("lifeos:theme", m);
    } catch {}
  };

  const value: ThemeCtx = {
    mode,
    setMode,
    toggle: () => setMode(mode === "dark" ? "light" : "dark"),
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        style={THEME_VARS[mode] as React.CSSProperties}
        className="min-h-screen font-sans antialiased"
      >
        {children}
        <Toaster
          theme={mode}
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}

// ---------- Root / Auth Gate ----------

function LifeOSRoot() {
  return (
    <ThemeProvider>
      <AuthGate />
    </ThemeProvider>
  );
}

function AuthGate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeos:auth");
      if (saved === "1") setIsAuthenticated(true);
      const savedUser = localStorage.getItem("lifeos:user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
  }, []);

  const login = (u: UserProfile) => {
    setUser(u);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("lifeos:auth", "1");
      localStorage.setItem("lifeos:user", JSON.stringify(u));
    } catch {}
    toast.success(`Bem-vindo(a), ${u.name.split(" ")[0]}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("lifeos:auth");
    } catch {}
    toast("Sessão encerrada");
  };

  const updateUser = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem("lifeos:user", JSON.stringify(u));
    } catch {}
  };

  if (!isAuthenticated) return <AuthPage onLogin={login} />;

  return <LifeOS user={user} onUpdateUser={updateUser} onLogout={logout} />;
}

// ---------- Auth Page ----------

function AuthPage({ onLogin }: { onLogin: (u: UserProfile) => void }) {
  const { mode, toggle } = useTheme();
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-[var(--app)] text-[var(--text)] flex items-center justify-center px-4 relative">
      <button
        onClick={toggle}
        aria-label="Alternar tema"
        className="absolute top-5 right-5 w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent-text)] hover:border-[var(--accent-border)] transition-colors"
      >
        {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--accent-text)]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--accent-text)] leading-none">
              Life OS
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[var(--muted-2)] mt-1">
              Seu sistema pessoal
            </p>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xl">
          <div className="flex bg-[var(--card-2)] rounded-lg p-1 mb-6 relative">
            {(["login", "signup"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 relative py-2 text-sm font-medium rounded-md transition-colors z-10 ${
                  tab === k ? "text-[var(--accent-fg)]" : "text-[var(--muted)]"
                }`}
              >
                {tab === k && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-md bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{k === "login" ? "Entrar" : "Criar conta"}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "login" ? (
                <LoginForm onSubmit={onLogin} />
              ) : (
                <SignupForm onSubmit={onLogin} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-[var(--muted-2)] mt-6">
          Dados salvos apenas neste navegador — MVP front-end.
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit }: { onSubmit: (u: UserProfile) => void }) {
  const [email, setEmail] = useState("lucas@email.com");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
          toast.error("Preencha e-mail e senha.");
          return;
        }
        onSubmit({ name: DEFAULT_USER.name, email: email.trim() });
      }}
      className="flex flex-col gap-4"
    >
      <Field label="E-mail" icon={<Mail className="w-3.5 h-3.5" />}>
        <input
          type="email"
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
      </Field>
      <Field label="Senha" icon={<Lock className="w-3.5 h-3.5" />}>
        <input
          type="password"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      <PrimaryButton type="submit" full>
        Entrar
      </PrimaryButton>
    </form>
  );
}

function SignupForm({ onSubmit }: { onSubmit: (u: UserProfile) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
          toast.error("Preencha todos os campos.");
          return;
        }
        onSubmit({ name: name.trim(), email: email.trim() });
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Nome" icon={<UserIcon className="w-3.5 h-3.5" />}>
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </Field>
      <Field label="E-mail" icon={<Mail className="w-3.5 h-3.5" />}>
        <input
          type="email"
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
      </Field>
      <Field label="Senha" icon={<Lock className="w-3.5 h-3.5" />}>
        <input
          type="password"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
      </Field>
      <PrimaryButton type="submit" full>
        Criar Conta
      </PrimaryButton>
    </form>
  );
}

// ---------- Main App ----------

type PageKey = "overview" | "tasks" | "habits" | "profile";

function LifeOS({
  user,
  onUpdateUser,
  onLogout,
}: {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onLogout: () => void;
}) {
  const [page, setPage] = useState<PageKey>("overview");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const toggleHabit = (id: string) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, doneToday: !h.doneToday, streak: h.doneToday ? Math.max(0, h.streak - 1) : h.streak + 1 }
          : h,
      ),
    );

  const saveTask = (t: Task) => {
    setTasks((prev) =>
      prev.some((p) => p.id === t.id) ? prev.map((p) => (p.id === t.id ? t : p)) : [t, ...prev],
    );
    toast.success("Tarefa salva.");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast("Tarefa excluída.");
  };

  const saveHabit = (h: Habit) => {
    setHabits((prev) =>
      prev.some((p) => p.id === h.id) ? prev.map((p) => (p.id === h.id ? h : p)) : [h, ...prev],
    );
    toast.success("Hábito salvo.");
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast("Hábito excluído.");
  };

  return (
    <div className="flex min-h-screen bg-[var(--app)] text-[var(--text)]">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-1 ml-64 p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {page === "overview" && (
              <Overview tasks={tasks} habits={habits} toggleHabit={toggleHabit} user={user} />
            )}
            {page === "tasks" && (
              <TasksPage
                tasks={tasks}
                toggleTask={toggleTask}
                saveTask={saveTask}
                deleteTask={deleteTask}
              />
            )}
            {page === "habits" && (
              <HabitsPage
                habits={habits}
                toggleHabit={toggleHabit}
                saveHabit={saveHabit}
                deleteHabit={deleteHabit}
              />
            )}
            {page === "profile" && <ProfilePage user={user} onUpdateUser={onUpdateUser} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------- Sidebar ----------

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { key: "tasks", label: "Tarefas", icon: ListChecks },
  { key: "habits", label: "Hábitos", icon: Repeat },
  { key: "profile", label: "Perfil", icon: UserIcon },
];

function Sidebar({
  page,
  setPage,
  user,
  onLogout,
}: {
  page: PageKey;
  setPage: (p: PageKey) => void;
  user: UserProfile;
  onLogout: () => void;
}) {
  const { mode, toggle } = useTheme();
  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--card)] border-r border-[var(--border)] backdrop-blur-sm flex flex-col p-6">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[var(--accent-text)]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[var(--accent-text)] leading-none">Life OS</h1>
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted-2)] mt-1">v1.0</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent-text)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hover)]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeBar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[var(--accent)]"
                />
              )}
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--border)] flex flex-col gap-3">
        <button
          onClick={toggle}
          className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border-2)] transition-colors text-sm"
        >
          <span className="flex items-center gap-2">
            {mode === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {mode === "dark" ? "Tema escuro" : "Tema claro"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
            Trocar
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--accent-fg)] font-semibold text-sm flex-shrink-0">
            {initials || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--muted-2)] truncate">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Sair"
            title="Sair"
            className="p-2 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ---------- Overview ----------

function Overview({
  tasks,
  habits,
  toggleHabit,
  user,
}: {
  tasks: Task[];
  habits: Habit[];
  toggleHabit: (id: string) => void;
  user: UserProfile;
}) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const priorities = tasks.filter((t) => !t.done).slice(0, 3);
  const doneToday = habits.filter((h) => h.doneToday).length;
  const firstName = user.name.split(" ")[0];

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-[var(--muted-2)]">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h2 className="text-3xl font-semibold mt-1">
          {greeting}, {firstName}.{" "}
          <span className="text-[var(--accent-text)]">Vamos ao que importa.</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Tarefas abertas" value={tasks.filter((t) => !t.done).length} />
        <StatCard label="Hábitos de hoje" value={`${doneToday}/${habits.length}`} />
        <StatCard
          label="Maior ofensiva"
          value={`${habits.length ? Math.max(...habits.map((h) => h.streak)) : 0} dias`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="3 Prioridades do Dia" icon={<ListChecks className="w-4 h-4" />} />
          <ul className="space-y-3">
            {priorities.map((t, i) => (
              <li
                key={t.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--card-2)] border border-[var(--border)]"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-semibold text-[var(--accent-text)]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text)]">{t.title}</p>
                  <div className="flex gap-2 mt-1.5">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-xs text-[var(--muted-2)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(t.date)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Check-in de Hábitos" icon={<Repeat className="w-4 h-4" />} />
          <ul className="space-y-2">
            {habits.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card-2)] border border-[var(--border)]"
              >
                <button
                  onClick={() => toggleHabit(h.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    h.doneToday
                      ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "bg-[var(--hover)] text-[var(--muted-2)] hover:text-[var(--text)]"
                  }`}
                >
                  <Check className="w-4 h-4" strokeWidth={3} />
                </button>
                <span
                  className={`flex-1 text-sm ${
                    h.doneToday ? "text-[var(--muted-2)] line-through" : "text-[var(--text)]"
                  }`}
                >
                  {h.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-orange-400/90 font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  {h.streak}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
      <p className="text-xs text-[var(--muted-2)] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-[var(--text)] mt-1">{value}</p>
    </div>
  );
}

// ---------- Tasks ----------

function TasksPage({
  tasks,
  toggleTask,
  saveTask,
  deleteTask,
}: {
  tasks: Task[];
  toggleTask: (id: string) => void;
  saveTask: (t: Task) => void;
  deleteTask: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <PageHeader title="Tarefas" subtitle="Foque no que move o ponteiro." />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" strokeWidth={3} /> Nova Tarefa
        </PrimaryButton>
      </div>

      <Card>
        <ul className="divide-y divide-[var(--border)]">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-center gap-4 py-3.5 first:pt-1 last:pb-1">
              <button
                onClick={() => toggleTask(t.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  t.done
                    ? "bg-[var(--accent)] border-[var(--accent)]"
                    : "border-[var(--border-2)] hover:border-[var(--accent-border)]"
                }`}
              >
                {t.done && <Check className="w-3 h-3 text-[var(--accent-fg)]" strokeWidth={4} />}
              </button>
              <div className={`flex-1 min-w-0 transition-all ${t.done ? "opacity-40 line-through" : ""}`}>
                <p className="text-sm text-[var(--text)] truncate">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-[var(--muted-2)] truncate mt-0.5">{t.description}</p>
                )}
              </div>
              <PriorityBadge priority={t.priority} />
              <span className="text-xs text-[var(--muted-2)] flex items-center gap-1 w-20 justify-end">
                <Calendar className="w-3 h-3" />
                {formatDate(t.date)}
              </span>
              <RowActions onEdit={() => setEditing(t)} onDelete={() => setConfirmId(t.id)} />
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="py-8 text-center text-sm text-[var(--muted-2)]">
              Nenhuma tarefa. Crie a primeira acima.
            </li>
          )}
        </ul>
      </Card>

      <SlideOver
        open={creating || !!editing}
        title={editing ? "Editar tarefa" : "Nova tarefa"}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <TaskForm
          initial={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(t) => {
            saveTask(t);
            setCreating(false);
            setEditing(null);
          }}
        />
      </SlideOver>

      <ConfirmDialog
        open={!!confirmId}
        title="Excluir tarefa?"
        message="Esta ação não pode ser desfeita."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) deleteTask(confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}

function TaskForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Task;
  onSave: (t: Task) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "Média");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
          id: initial?.id ?? `t_${Date.now()}`,
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          date,
          done: initial?.done ?? false,
        });
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Título">
        <input
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="O que precisa ser feito?"
          autoFocus
        />
      </Field>
      <Field label="Descrição">
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes, contexto, links..."
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prioridade">
          <select
            className={inputCls}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
        </Field>
        <Field label="Vencimento">
          <input
            type="date"
            className={inputCls}
            value={date.length === 10 ? date : new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </div>

      <FormActions onCancel={onCancel} />
    </form>
  );
}

// ---------- Habits ----------

function HabitsPage({
  habits,
  toggleHabit,
  saveHabit,
  deleteHabit,
}: {
  habits: Habit[];
  toggleHabit: (id: string) => void;
  saveHabit: (h: Habit) => void;
  deleteHabit: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Habit | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader title="Hábitos" subtitle="Pequenas ações, resultados compostos." />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" strokeWidth={3} /> Novo Hábito
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {habits.map((h) => (
          <motion.div
            key={h.id}
            whileHover={{ y: -2 }}
            className="group relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 shadow-sm"
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <RowActions onEdit={() => setEditing(h)} onDelete={() => setConfirmId(h.id)} />
            </div>

            <div className="flex items-start justify-between mb-1 pr-16">
              <h3 className="text-base font-medium text-[var(--text)]">{h.name}</h3>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1 text-xs font-medium text-orange-400/90 bg-orange-400/10 px-2 py-1 rounded-md">
                <Flame className="w-3.5 h-3.5" />
                {h.streak} dias
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
                Meta {h.weeklyGoal}x/sem
              </span>
            </div>

            {h.motivation && (
              <p className="text-xs text-[var(--muted-2)] mb-4 line-clamp-2">{h.motivation}</p>
            )}

            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < Math.min(h.streak, 7) ? "bg-[var(--accent)]/80" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => toggleHabit(h.id)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                h.doneToday
                  ? "bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--accent-border)]"
                  : "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]"
              }`}
            >
              {h.doneToday ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={3} /> Feito hoje
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" strokeWidth={3} /> Registrar hoje
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <SlideOver
        open={creating || !!editing}
        title={editing ? "Editar hábito" : "Novo hábito"}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <HabitForm
          initial={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(h) => {
            saveHabit(h);
            setCreating(false);
            setEditing(null);
          }}
        />
      </SlideOver>

      <ConfirmDialog
        open={!!confirmId}
        title="Excluir hábito?"
        message="Você perderá o histórico visual dessa ofensiva."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) deleteHabit(confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}

function HabitForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Habit;
  onSave: (h: Habit) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [motivation, setMotivation] = useState(initial?.motivation ?? "");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(initial?.weeklyGoal ?? 5);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({
          id: initial?.id ?? `h_${Date.now()}`,
          name: name.trim(),
          motivation: motivation.trim() || undefined,
          weeklyGoal: Math.max(1, Math.min(7, Number(weeklyGoal) || 1)),
          streak: initial?.streak ?? 0,
          doneToday: initial?.doneToday ?? false,
        });
      }}
      className="flex flex-col gap-4"
    >
      <Field label="Nome do hábito">
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Meditar 10 minutos"
          autoFocus
        />
      </Field>
      <Field label="Categoria / Motivação">
        <textarea
          className={`${inputCls} min-h-24 resize-y`}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Por que esse hábito importa para você?"
        />
      </Field>
      <Field label="Meta semanal (dias)">
        <input
          type="number"
          min={1}
          max={7}
          className={inputCls}
          value={weeklyGoal}
          onChange={(e) => setWeeklyGoal(Number(e.target.value))}
        />
      </Field>

      <FormActions onCancel={onCancel} />
    </form>
  );
}

// ---------- Profile ----------

function ProfilePage({
  user,
  onUpdateUser,
}: {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}) {
  const { mode, setMode } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  return (
    <div className="max-w-3xl">
      <PageHeader title="Perfil" subtitle="Ajuste seus dados, segurança e aparência." />

      <div className="mt-6 flex flex-col gap-6">
        <Card>
          <CardHeader title="Dados Pessoais" icon={<UserIcon className="w-4 h-4" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome">
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <PrimaryButton
              onClick={() => {
                if (!name.trim() || !email.trim()) {
                  toast.error("Nome e e-mail são obrigatórios.");
                  return;
                }
                onUpdateUser({ name: name.trim(), email: email.trim() });
                toast.success("Alterações salvas.");
              }}
            >
              Salvar Alterações
            </PrimaryButton>
          </div>
        </Card>

        <Card>
          <CardHeader title="Segurança" icon={<Shield className="w-4 h-4" />} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Senha atual">
              <input
                type="password"
                className={inputCls}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Nova senha">
              <input
                type="password"
                className={inputCls}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </Field>
            <Field label="Confirmar nova senha">
              <input
                type="password"
                className={inputCls}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repita a nova senha"
              />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <PrimaryButton
              onClick={() => {
                if (!currentPw || !newPw || !confirmPw) {
                  toast.error("Preencha todos os campos de senha.");
                  return;
                }
                if (newPw !== confirmPw) {
                  toast.error("As senhas não coincidem.");
                  return;
                }
                setCurrentPw("");
                setNewPw("");
                setConfirmPw("");
                toast.success("Senha atualizada.");
              }}
            >
              Atualizar Senha
            </PrimaryButton>
          </div>
        </Card>

        <Card>
          <CardHeader title="Aparência" icon={<Palette className="w-4 h-4" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThemeChoice
              active={mode === "dark"}
              onClick={() => setMode("dark")}
              title="Tema Escuro"
              subtitle="Verde esmeralda"
              icon={<Moon className="w-4 h-4" />}
              swatch={["#09090b", "#18181b", "#10b981"]}
            />
            <ThemeChoice
              active={mode === "light"}
              onClick={() => setMode("light")}
              title="Tema Claro"
              subtitle="Dourado elegante"
              icon={<Sun className="w-4 h-4" />}
              swatch={["#f9fafb", "#ffffff", "#ca8a04"]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ThemeChoice({
  active,
  onClick,
  title,
  subtitle,
  icon,
  swatch,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  swatch: string[];
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border transition-all ${
        active
          ? "border-[var(--accent-border)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--card-2)] hover:border-[var(--border-2)]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={active ? "text-[var(--accent-text)]" : "text-[var(--muted)]"}>
            {icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
            <p className="text-xs text-[var(--muted-2)]">{subtitle}</p>
          </div>
        </div>
        <span
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            active ? "border-[var(--accent)]" : "border-[var(--border-2)]"
          }`}
        >
          {active && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
        </span>
      </div>
      <div className="flex gap-1.5">
        {swatch.map((c) => (
          <span
            key={c}
            className="h-6 flex-1 rounded-md border border-black/10"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </button>
  );
}

// ---------- Shared UI ----------

const inputCls =
  "w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-2)] outline-none focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-soft)] transition";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)] flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  full = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors ${
        full ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  type = "button",
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  tone?: "neutral" | "danger";
}) {
  const toneCls =
    tone === "danger"
      ? "border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
      : "border-[var(--border-2)] text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-transparent border font-medium text-sm px-4 py-2.5 rounded-lg transition-colors ${toneCls}`}
    >
      {children}
    </button>
  );
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-[var(--border)]">
      <GhostButton onClick={onCancel}>Cancelar</GhostButton>
      <PrimaryButton type="submit">Salvar</PrimaryButton>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        aria-label="Editar"
        className="p-1.5 rounded-md text-[var(--muted-2)] hover:text-[var(--accent-text)] hover:bg-[var(--accent-soft)] transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onDelete}
        aria-label="Excluir"
        className="p-1.5 rounded-md text-[var(--muted-2)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function SlideOver({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="p-1.5 rounded-md text-[var(--muted-2)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-6"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[var(--text)]">{title}</h4>
                <p className="text-sm text-[var(--muted-2)] mt-1">{message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <GhostButton onClick={onCancel}>Cancelar</GhostButton>
              <button
                onClick={onConfirm}
                className="inline-flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h2 className="text-3xl font-semibold text-[var(--text)]">{title}</h2>
      <p className="text-sm text-[var(--muted-2)] mt-1">{subtitle}</p>
    </header>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 shadow-sm">
      {children}
    </div>
  );
}

function CardHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[var(--accent-text)]">{icon}</span>
      <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Alta: "bg-red-500/10 text-red-500 border border-red-500/20",
    Média: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    Baixa: "bg-[var(--card-2)] text-[var(--muted)] border border-[var(--border)]",
  };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function formatDate(d: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }
  return d;
}
