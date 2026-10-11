import type { CefrLevel, TechLevel, TechnologyId } from "../lib/constants";

export type SeedQuestion = {
  quizType: "tech" | "cefr";
  technology?: TechnologyId;
  level?: TechLevel;
  cefrLevel?: CefrLevel;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
};

const OPTION_IDS = ["a", "b", "c", "d"] as const;

function mcq(
  questionText: string,
  correct: string,
  wrongs: [string, string, string],
  explanation?: string
): Pick<
  SeedQuestion,
  "questionText" | "options" | "correctOptionId" | "explanation"
> {
  const texts = [correct, ...wrongs];
  const options = OPTION_IDS.map((id, index) => ({ id, text: texts[index] }));
  return {
    questionText,
    options,
    correctOptionId: "a",
    explanation,
  };
}

type Topic = {
  questionText: string;
  correct: string;
  wrongs: [string, string, string];
  explanation: string;
};

const reactTopics: Record<TechLevel, Topic[]> = {
  fresher: [
    {
      questionText: "What does JSX let you write in a React component?",
      correct: "HTML-like markup that compiles to React.createElement calls",
      wrongs: [
        "Raw SQL queries against a database",
        "CSS that is injected into the <head> automatically",
        "Python code that React converts to JavaScript",
      ],
      explanation: "JSX is syntactic sugar for creating React elements.",
    },
    {
      questionText: "How do you pass data from a parent to a child component?",
      correct: "Using props",
      wrongs: ["Using Redux only", "Using window.localStorage", "Using CSS variables"],
      explanation: "Props are the standard one-way data flow from parent to child.",
    },
    {
      questionText: "Which hook stores component-local state in a function component?",
      correct: "useState",
      wrongs: ["useRouter", "useRef only for layout", "componentDidMount"],
      explanation: "useState is the primary hook for local state.",
    },
    {
      questionText: "What must a React component return?",
      correct: "Valid React elements, null, or fragments",
      wrongs: ["A database cursor", "A Node.js Buffer", "A CSS stylesheet object only"],
      explanation: "Components render UI (or nothing) via React nodes.",
    },
    {
      questionText: "Why do list items in React usually need a key prop?",
      correct: "To help React identify which items changed",
      wrongs: [
        "To encrypt the list on the server",
        "To force a full page reload",
        "To disable Strict Mode",
      ],
      explanation: "Keys give list items a stable identity during reconciliation.",
    },
    {
      questionText: "What is the correct way to update state based on the previous value?",
      correct: "Pass a function to the state setter: setCount((n) => n + 1)",
      wrongs: [
        "Mutate state.count++ directly",
        "Call setCount after a setTimeout of 0 always",
        "Use document.getElementById",
      ],
      explanation: "Functional updates avoid stale closures when updates queue.",
    },
    {
      questionText: "What does useEffect run after by default?",
      correct: "After the component paints (commit) on the screen",
      wrongs: [
        "Before the browser parses HTML",
        "Only on the server during SSR",
        "Instead of rendering JSX",
      ],
      explanation: "Effects run after paint unless you use a layout effect.",
    },
    {
      questionText: "How do you render a child only when a boolean is true?",
      correct: "Use conditional rendering such as {isOpen && <Panel />}",
      wrongs: [
        "Put an if statement inside JSX attributes only",
        "Use <!-- comments --> in JSX",
        "Assign the component to window",
      ],
      explanation: "Logical && or ternaries are the usual pattern.",
    },
    {
      questionText: "What is lifting state up?",
      correct: "Moving shared state to the closest common parent",
      wrongs: [
        "Moving CSS into a CDN",
        "Converting class components to HTML",
        "Storing props in cookies",
      ],
      explanation: "Shared state lives in a parent so siblings stay in sync.",
    },
    {
      questionText: "Which attribute in JSX corresponds to the HTML class attribute?",
      correct: "className",
      wrongs: ["class", "cssClass", "clazz"],
      explanation: "class is reserved in JavaScript, so JSX uses className.",
    },
    {
      questionText: "What does a controlled input mean in React?",
      correct: "Its value is driven by React state and an onChange handler",
      wrongs: [
        "The browser owns the value and React never reads it",
        "It can only be a checkbox",
        "It must be wrapped in Redux Form",
      ],
      explanation: "Controlled inputs keep the source of truth in React state.",
    },
    {
      questionText: "What is React's default data flow direction?",
      correct: "One-way: parent to child via props",
      wrongs: [
        "Two-way binding like old AngularJS by default",
        "Child to parent only",
        "Sibling to sibling without a parent",
      ],
      explanation: "React is unidirectional; callbacks go up, props go down.",
    },
    {
      questionText: "Which file extension is commonly used for React components with JSX?",
      correct: ".jsx or .tsx",
      wrongs: [".sql", ".py", ".css only"],
      explanation: "JSX lives in .jsx / .tsx files (or configured .js).",
    },
    {
      questionText: "What does fragments (<> </>) let you return?",
      correct: "Multiple children without an extra DOM node",
      wrongs: [
        "A new browser tab",
        "Server-only HTML comments",
        "A WebSocket connection",
      ],
      explanation: "Fragments group nodes without adding a wrapper element.",
    },
    {
      questionText: "How should you attach a click handler in React?",
      correct: "onClick={handler} with a function",
      wrongs: [
        "onclick=\"handler()\" as a string",
        "addEventListener in JSX attributes",
        "href=\"javascript:handler()\"",
      ],
      explanation: "React uses camelCase event props that take functions.",
    },
  ],
  junior: [
    {
      questionText: "When should you include values in a useEffect dependency array?",
      correct: "When the effect reads those values and should re-run if they change",
      wrongs: [
        "Never; empty arrays are always correct",
        "Only for CSS class names",
        "Only on the first render of the app",
      ],
      explanation: "Dependencies declare reactive inputs to the effect.",
    },
    {
      questionText: "What does useMemo help you avoid?",
      correct: "Recomputing an expensive value on every render unless deps change",
      wrongs: [
        "Network latency on the server",
        "The need for keys on lists",
        "Using TypeScript",
      ],
      explanation: "useMemo caches a computation between renders.",
    },
    {
      questionText: "What is the main purpose of useCallback?",
      correct: "To keep a function identity stable when passed to memoized children",
      wrongs: [
        "To call APIs during SSR only",
        "To replace useState",
        "To disable React Strict Mode",
      ],
      explanation: "Stable callbacks reduce unnecessary child re-renders.",
    },
    {
      questionText: "What does React.memo do?",
      correct: "Skips re-rendering a component if its props are shallowly equal",
      wrongs: [
        "Memoizes Redux store forever",
        "Caches fetch() in the browser HTTP cache",
        "Converts class components automatically",
      ],
      explanation: "memo is a performance optimization for pure components.",
    },
    {
      questionText: "Why might you use a key that is a unique id instead of the array index?",
      correct: "Indexes break when items are inserted, removed, or reordered",
      wrongs: [
        "Indexes are illegal in React 18",
        "Unique ids disable reconciliation",
        "Keys are optional when using indexes",
      ],
      explanation: "Stable identities prevent state from attaching to the wrong row.",
    },
    {
      questionText: "What is a common use of useRef besides accessing a DOM node?",
      correct: "Holding a mutable value that does not trigger re-renders",
      wrongs: [
        "Replacing all component state",
        "Fetching data during render",
        "Defining CSS modules",
      ],
      explanation: "Refs persist across renders without causing updates.",
    },
    {
      questionText: "What does Context provide?",
      correct: "A way to pass data through the tree without prop drilling",
      wrongs: [
        "A replacement for HTTP",
        "Automatic database transactions",
        "CSS-in-JS by default",
      ],
      explanation: "Context is for ambient data like theme or locale.",
    },
    {
      questionText: "What should you avoid doing during render?",
      correct: "Triggering side effects such as fetching or writing to the DOM",
      wrongs: [
        "Computing derived values from props",
        "Returning JSX",
        "Reading props",
      ],
      explanation: "Side effects belong in effects or event handlers.",
    },
    {
      questionText: "How do you prevent a form submit from reloading the page?",
      correct: "Call event.preventDefault() in the submit handler",
      wrongs: [
        "Use <form method=\"dialog\" /> only",
        "Set window.location to '#'",
        "Disable JavaScript",
      ],
      explanation: "SPA forms must cancel the native navigation.",
    },
    {
      questionText: "What is an error boundary used for?",
      correct: "Catching render errors in the child tree and showing a fallback",
      wrongs: [
        "Catching CSS parse errors",
        "Replacing try/catch in async event handlers automatically",
        "Validating environment variables",
      ],
      explanation: "Error boundaries handle render-phase failures in class components (or libraries).",
    },
    {
      questionText: "Why might two components sharing state via Context still re-render often?",
      correct: "Any context value change re-renders all consumers",
      wrongs: [
        "Context never causes re-renders",
        "Context only works with class components",
        "Context batches out all updates",
      ],
      explanation: "Split contexts or memoize value objects to reduce churn.",
    },
    {
      questionText: "What does Strict Mode do in development?",
      correct: "Intentionally double-invokes some lifecycles/effects to surface bugs",
      wrongs: [
        "Enables production minification",
        "Turns off hooks",
        "Disables the virtual DOM",
      ],
      explanation: "Double rendering in dev helps find impure render logic.",
    },
    {
      questionText: "How do you lazily load a component?",
      correct: "React.lazy with a dynamic import and a Suspense fallback",
      wrongs: [
        "eval() the component source",
        "Put the component in localStorage",
        "Use an <iframe> only",
      ],
      explanation: "Code-splitting uses lazy + Suspense.",
    },
    {
      questionText: "What is a custom hook?",
      correct: "A function starting with use that composes other hooks",
      wrongs: [
        "A CSS class prefixed with use-",
        "A Next.js middleware file",
        "A MongoDB trigger",
      ],
      explanation: "Custom hooks share stateful logic without changing the UI tree.",
    },
    {
      questionText: "Which statement about keys is true?",
      correct: "Keys should be unique among siblings, not globally unique in the app",
      wrongs: [
        "Keys must be UUIDs from a server",
        "Keys replace the need for state",
        "Keys are read by CSS selectors",
      ],
      explanation: "Reconciliation only compares keys among siblings.",
    },
  ],
  senior: [
    {
      questionText: "What problem does concurrent rendering help with?",
      correct: "Keeping the UI responsive by interrupting low-priority work",
      wrongs: [
        "Making MongoDB queries transactional",
        "Removing the need for keys",
        "Replacing TypeScript types",
      ],
      explanation: "Concurrency lets React yield so urgent updates can render first.",
    },
    {
      questionText: "When is useTransition useful?",
      correct: "Marking a state update as non-urgent so input stays snappy",
      wrongs: [
        "Replacing CSS transitions",
        "Scheduling cron jobs on Vercel",
        "Hydrating only class components",
      ],
      explanation: "startTransition defers heavy UI updates.",
    },
    {
      questionText: "What is a typical risk of putting a new object in Context value each render?",
      correct: "All consumers re-render even if the logical data did not change",
      wrongs: [
        "React will crash immediately",
        "Hooks will stop working",
        "SSR will be disabled",
      ],
      explanation: "Memoize context values to preserve referential equality.",
    },
    {
      questionText: "Why might you prefer composition over a deep prop-drilled config object?",
      correct: "Slots/children keep coupling local and avoid brittle prop chains",
      wrongs: [
        "Composition is slower than prop drilling always",
        "React forbids children",
        "Config objects cannot be typed",
      ],
      explanation: "Compound components and children scale better than huge configs.",
    },
    {
      questionText: "What does hydration mismatch usually indicate?",
      correct: "Server HTML and the first client render produced different trees",
      wrongs: [
        "MongoDB replica lag",
        "A missing Tailwind class",
        "An unused ESLint rule",
      ],
      explanation: "SSR and client render must agree on the initial tree.",
    },
    {
      questionText: "How can you keep a list virtualized for performance?",
      correct: "Render only visible rows with a windowing library",
      wrongs: [
        "Wrap the list in React.memo without measuring",
        "Put every row in Context",
        "Disable Strict Mode",
      ],
      explanation: "Windowing avoids mounting thousands of DOM nodes.",
    },
    {
      questionText: "What is the render-phase vs commit-phase distinction?",
      correct: "Render computes the next tree; commit applies it to the DOM",
      wrongs: [
        "They are the same in React 18",
        "Commit happens only on the server",
        "Render cannot be interrupted",
      ],
      explanation: "Effects run after commit; render should stay pure.",
    },
    {
      questionText: "When would you use useLayoutEffect instead of useEffect?",
      correct: "When you must measure or mutate the DOM before the browser paints",
      wrongs: [
        "For all data fetching",
        "For CSS-only animations always",
        "Because it runs on the server",
      ],
      explanation: "Layout effects block paint; use sparingly.",
    },
    {
      questionText: "What is a portable pattern for sharing non-UI state across routes in Next.js App Router?",
      correct: "URL search params, cookies, or a server store — not a giant client global by default",
      wrongs: [
        "A module-level let in a Server Component",
        "window.__STATE only",
        "Mutating process.env at runtime",
      ],
      explanation: "Server Components cannot use client global stores; pick explicit state homes.",
    },
    {
      questionText: "Why can derived state that is copied from props become a bug source?",
      correct: "It can go stale when props change unless you sync carefully",
      wrongs: [
        "Props cannot be numbers",
        "React forbids derived values",
        "Keys become invalid",
      ],
      explanation: "Prefer computing during render or resetting with a key.",
    },
    {
      questionText: "What does batching of updates mean in React 18?",
      correct: "Multiple setState calls in the same event are applied together",
      wrongs: [
        "Only one component can update per minute",
        "Network requests are merged",
        "CSS files are concatenated",
      ],
      explanation: "Automatic batching reduces extra renders.",
    },
    {
      questionText: "How do you cancel an in-flight fetch when a component unmounts or inputs change?",
      correct: "Use AbortController in the effect cleanup",
      wrongs: [
        "Set a global canceled = true without aborting",
        "Throw during render",
        "Disable JavaScript",
      ],
      explanation: "Aborting avoids race conditions and setState-on-unmount warnings.",
    },
    {
      questionText: "What is a reasonable reason to colocate state lower in the tree?",
      correct: "To avoid re-rendering a large parent when only a leaf needs the state",
      wrongs: [
        "To hide state from React DevTools",
        "Because Context cannot hold primitives",
        "To skip using keys",
      ],
      explanation: "State placement is a performance and clarity decision.",
    },
    {
      questionText: "What problem do server actions / route handlers solve compared with putting secrets in client components?",
      correct: "They keep privileged logic and secrets on the server",
      wrongs: [
        "They make CSS load faster only",
        "They remove the need for HTTPS",
        "They replace MongoDB indexes",
      ],
      explanation: "Client bundles must not contain secrets or grading keys.",
    },
    {
      questionText: "When profiling a slow screen, what should you check first?",
      correct: "Whether expensive work runs on every render and which components re-render",
      wrongs: [
        "Whether the domain uses IPv6",
        "Whether Tailwind JIT is enabled",
        "Whether the favicon is SVG",
      ],
      explanation: "The React profiler and why-did-you-render style checks find wasted renders.",
    },
  ],
};

const nodeTopics: Record<TechLevel, Topic[]> = {
  fresher: [
    {
      questionText: "What is Node.js primarily used for?",
      correct: "Running JavaScript on the server (outside the browser)",
      wrongs: [
        "Compiling C++ to WebAssembly only",
        "Replacing CSS in the browser",
        "Hosting only static HTML without JS",
      ],
      explanation: "Node is a JavaScript runtime built on V8.",
    },
    {
      questionText: "Which module system is native in CommonJS files?",
      correct: "require / module.exports",
      wrongs: ["import/export only in every .js file without flags", "using namespace std", "pip install"],
      explanation: "Classic Node uses CommonJS; ESM is also supported with \"type\": \"module\".",
    },
    {
      questionText: "What does npm stand for in everyday use?",
      correct: "The default package manager for Node packages",
      wrongs: [
        "A MongoDB GUI",
        "A CSS preprocessor",
        "A Kubernetes controller",
      ],
      explanation: "npm installs packages from the registry into node_modules.",
    },
    {
      questionText: "What is package.json used for?",
      correct: "Declaring dependencies, scripts, and package metadata",
      wrongs: [
        "Storing MongoDB documents",
        "Defining CSS variables",
        "Replacing HTTPS certificates",
      ],
      explanation: "It is the manifest for a Node project.",
    },
    {
      questionText: "How do you start a file with Node from the terminal?",
      correct: "node app.js",
      wrongs: ["python app.js", "mongo app.js", "next app.js without Node"],
      explanation: "The node binary executes a JavaScript file.",
    },
    {
      questionText: "What does process.env contain?",
      correct: "Environment variables available to the process",
      wrongs: [
        "Only CSS custom properties",
        "The MongoDB oplog",
        "Browser localStorage",
      ],
      explanation: "Config like DATABASE_URL is typically read from env.",
    },
    {
      questionText: "What is the event loop's role?",
      correct: "Scheduling callbacks so Node can handle I/O without blocking the main thread the same way threads would",
      wrongs: [
        "Rendering React components",
        "Compiling TypeScript",
        "Sharding MongoDB",
      ],
      explanation: "Node is event-driven and non-blocking for many I/O APIs.",
    },
    {
      questionText: "Which core module reads and writes files?",
      correct: "fs",
      wrongs: ["http only", "path only", "os only"],
      explanation: "fs provides filesystem APIs (sync and async).",
    },
    {
      questionText: "What does path.join help you do?",
      correct: "Build filesystem paths in a cross-platform way",
      wrongs: [
        "Join SQL tables",
        "Merge git branches",
        "Concatenate CSS files",
      ],
      explanation: "path handles separators on Windows vs Unix.",
    },
    {
      questionText: "What is a callback in Node-style APIs?",
      correct: "A function invoked later with (error, result) or similar",
      wrongs: [
        "A CSS animation",
        "A MongoDB index",
        "A React key",
      ],
      explanation: "Older Node APIs use error-first callbacks.",
    },
    {
      questionText: "What do Promises represent?",
      correct: "A future value that may succeed or fail asynchronously",
      wrongs: [
        "A guaranteed database lock",
        "A CSS promise of layout",
        "A synchronous return only",
      ],
      explanation: "Promises (and async/await) structure async flow.",
    },
    {
      questionText: "What is Express commonly used for?",
      correct: "Building HTTP APIs and web servers",
      wrongs: [
        "Replacing the V8 engine",
        "Styling React components",
        "Managing Mongo replica sets",
      ],
      explanation: "Express is a minimal web framework for Node.",
    },
    {
      questionText: "What does middleware in Express do?",
      correct: "Runs on the request/response cycle, often calling next()",
      wrongs: [
        "Compiles TypeScript",
        "Seeds MongoDB",
        "Bundles CSS",
      ],
      explanation: "Middleware can log, parse JSON, authenticate, etc.",
    },
    {
      questionText: "How do you send JSON from Express?",
      correct: "res.json(payload)",
      wrongs: ["res.mongo(payload)", "console.json(payload)", "document.write(payload)"],
      explanation: "res.json sets the content type and stringifies.",
    },
    {
      questionText: "What is node_modules?",
      correct: "The folder where installed packages live",
      wrongs: [
        "The MongoDB data directory",
        "A React component folder required by Node",
        "The Nginx config folder",
      ],
      explanation: "Dependencies resolve from node_modules.",
    },
  ],
  junior: [
    {
      questionText: "What is the difference between process.nextTick and setImmediate?",
      correct: "nextTick queues before I/O callbacks; setImmediate runs on the check phase",
      wrongs: [
        "They are identical aliases",
        "setImmediate is browser-only",
        "nextTick blocks MongoDB",
      ],
      explanation: "They schedule work at different points in the event loop.",
    },
    {
      questionText: "Why prefer async fs.promises over fs.readFileSync in a server?",
      correct: "Sync I/O blocks the event loop and stalls other requests",
      wrongs: [
        "Async APIs cannot read files",
        "Sync APIs are deprecated in browsers",
        "Promises are slower always",
      ],
      explanation: "Servers should avoid blocking the single JS thread.",
    },
    {
      questionText: "What does cluster mode help with?",
      correct: "Using multiple processes to utilize more CPU cores",
      wrongs: [
        "Sharding Mongo automatically",
        "Minifying JavaScript",
        "Enabling CORS",
      ],
      explanation: "One Node process is single-threaded for JS; cluster forks workers.",
    },
    {
      questionText: "What is a stream useful for?",
      correct: "Processing data in chunks without loading the whole payload in memory",
      wrongs: [
        "Only playing audio in the browser",
        "Replacing HTTP",
        "Defining React context",
      ],
      explanation: "Readable/writable streams handle large files and pipes.",
    },
    {
      questionText: "How should you handle unhandled promise rejections in production?",
      correct: "Log them and fail fast or recover according to policy — do not ignore",
      wrongs: [
        "They can never happen",
        "Silence them with empty catch everywhere only",
        "Convert them to CSS errors",
      ],
      explanation: "Unhandled rejections can crash the process depending on Node version/flags.",
    },
    {
      questionText: "What does helmet (or similar) help with in Express?",
      correct: "Setting security-related HTTP headers",
      wrongs: [
        "Encrypting MongoDB at rest automatically",
        "Replacing TLS certificates",
        "Minifying React",
      ],
      explanation: "Security headers reduce common web risks.",
    },
    {
      questionText: "Why validate request bodies on the server?",
      correct: "Clients can send anything; validation protects your app and database",
      wrongs: [
        "Browsers always send perfect JSON",
        "Zod only works on the client",
        "MongoDB rejects all extra fields by default always",
      ],
      explanation: "Never trust client input.",
    },
    {
      questionText: "What is the purpose of a reverse proxy like Nginx in front of Node?",
      correct: "TLS termination, static files, load balancing, and hiding the app port",
      wrongs: [
        "Compiling TypeScript",
        "Replacing the event loop",
        "Storing sessions in CSS",
      ],
      explanation: "Node often sits behind a proxy in production.",
    },
    {
      questionText: "What does CORS control?",
      correct: "Which origins a browser is allowed to call your API from",
      wrongs: [
        "Which Mongo collections exist",
        "CPU affinity",
        "React key uniqueness",
      ],
      explanation: "CORS is a browser security feature.",
    },
    {
      questionText: "When would you use a worker thread?",
      correct: "For CPU-heavy JavaScript that would block the event loop",
      wrongs: [
        "For every HTTP request always",
        "To parse JSON in Express",
        "To replace MongoDB indexes",
      ],
      explanation: "Workers help with CPU-bound work; I/O is usually async.",
    },
    {
      questionText: "What is 12-factor style config?",
      correct: "Store config in the environment, not in committed secrets",
      wrongs: [
        "Hardcode passwords in source",
        "Put secrets in the client bundle",
        "Use the same .env in every public gist",
      ],
      explanation: "Env-based config fits Vercel and containers.",
    },
    {
      questionText: "What does graceful shutdown typically involve?",
      correct: "Stop accepting new connections and finish in-flight work before exit",
      wrongs: [
        "kill -9 immediately always",
        "Delete node_modules",
        "Drop the database",
      ],
      explanation: "SIGTERM handlers close servers cleanly.",
    },
    {
      questionText: "Why pin dependency versions in production?",
      correct: "To get reproducible builds and avoid surprise breaking changes",
      wrongs: [
        "npm cannot install ranges",
        "Lockfiles are illegal on Vercel",
        "Node ignores versions",
      ],
      explanation: "package-lock.json (or similar) locks the tree.",
    },
    {
      questionText: "What is the N+1 problem in APIs talking to a database?",
      correct: "Issuing one query per item instead of a batched query",
      wrongs: [
        "Using too many CPU cores",
        "Having more routes than files",
        "Using HTTP/2",
      ],
      explanation: "Chatty query patterns crush latency.",
    },
    {
      questionText: "How do you structure errors for an API client?",
      correct: "Stable HTTP status codes plus a consistent JSON error body",
      wrongs: [
        "Always HTTP 200 with errors in HTML comments",
        "Throw strings only",
        "Redirect to Google",
      ],
      explanation: "Clients need predictable error contracts.",
    },
  ],
  senior: [
    {
      questionText: "What does backpressure in streams mean?",
      correct: "A fast producer slowing down because the consumer cannot keep up",
      wrongs: [
        "HTTP/2 server push",
        "Mongo replica election",
        "React concurrent features",
      ],
      explanation: ".pause() / corking / highWaterMark implement backpressure.",
    },
    {
      questionText: "When is a message queue a better fit than a synchronous HTTP call?",
      correct: "For work that can be retried, delayed, or processed by workers asynchronously",
      wrongs: [
        "For every CSS request",
        "When you need a strong browser cache",
        "To replace TLS",
      ],
      explanation: "Queues decouple producers from slow consumers.",
    },
    {
      questionText: "What is the risk of a blocking native addon on the main thread?",
      correct: "It stalls the event loop the same way sync JS would",
      wrongs: [
        "It automatically shards Mongo",
        "It only affects CSS",
        "Node will multithread it always",
      ],
      explanation: "CPU/native blocks need workers or offloading.",
    },
    {
      questionText: "How do you keep secrets out of logs?",
      correct: "Redact tokens and PII; never log raw Authorization headers",
      wrongs: [
        "Log everything for observability",
        "Put secrets in query strings for tracing",
        "Print env on startup in production",
      ],
      explanation: "Logs are a common leak surface.",
    },
    {
      questionText: "What does connection pooling help with for databases?",
      correct: "Reusing open connections instead of connecting per request",
      wrongs: [
        "Sharding automatically",
        "Removing indexes",
        "Enabling CORS",
      ],
      explanation: "Handshake cost is high; pools reuse sockets.",
    },
    {
      questionText: "Why might you choose HTTP/2 or keep-alive between services?",
      correct: "To reduce connection setup overhead under high QPS",
      wrongs: [
        "To replace JSON with HTML",
        "Because Node cannot do HTTP/1.1",
        "To disable TLS",
      ],
      explanation: "Persistent connections cut latency.",
    },
    {
      questionText: "What is a circuit breaker used for?",
      correct: "Stopping calls to a failing dependency so your service degrades predictably",
      wrongs: [
        "Encrypting Mongo traffic",
        "Minifying JS",
        "Generating React keys",
      ],
      explanation: "Fail fast instead of cascading timeouts.",
    },
    {
      questionText: "How should you think about idempotency for POST-like APIs?",
      correct: "Clients may retry; design so duplicates do not double-charge or double-insert blindly",
      wrongs: [
        "POST is always safe to retry",
        "GET is never cached",
        "Idempotency only applies to CSS",
      ],
      explanation: "Idempotency keys are a common pattern.",
    },
    {
      questionText: "What is structured logging useful for?",
      correct: "Machine-parseable fields (request id, user id) for search and metrics",
      wrongs: [
        "Replacing APM",
        "Hiding errors from operators",
        "Compiling TypeScript faster",
      ],
      explanation: "JSON logs ship well to aggregators.",
    },
    {
      questionText: "Why isolate CPU-heavy work from the API process?",
      correct: "So request latency stays stable under compute spikes",
      wrongs: [
        "Because V8 cannot run loops",
        "To satisfy React rules of hooks",
        "Mongo requires it",
      ],
      explanation: "Separate workers/jobs protect the request path.",
    },
    {
      questionText: "What does zero-downtime deploy typically require of Node?",
      correct: "Drain connections and overlap old/new processes (or platform rolling updates)",
      wrongs: [
        "Restarting mongod on every deploy",
        "Clearing all Redis keys always",
        "Disabling health checks",
      ],
      explanation: "In-flight requests should finish on the old instance.",
    },
    {
      questionText: "When would you use OpenTelemetry in a Node service?",
      correct: "To propagate traces/metrics across services for debugging latency",
      wrongs: [
        "To replace unit tests",
        "To style the admin UI",
        "To generate Mongoose schemas",
      ],
      explanation: "Distributed tracing needs instrumentation.",
    },
    {
      questionText: "What is a good default for timeouts on outbound HTTP?",
      correct: "Set explicit connect and read timeouts; never wait forever",
      wrongs: [
        "No timeouts so you never fail",
        "Timeouts only in the browser",
        "One global 24h timeout",
      ],
      explanation: "Hanging sockets exhaust pools.",
    },
    {
      questionText: "How do you avoid leaking handles that keep the process alive in tests?",
      correct: "Close servers, timers, and DB connections in after hooks",
      wrongs: [
        "Use --exit always and ignore handles",
        "Never open a server in tests",
        "Disable Jest",
      ],
      explanation: "Open handles fail CI with --detectOpenHandles style checks.",
    },
    {
      questionText: "What is the advantage of a layered architecture (routes → services → db)?",
      correct: "Business rules stay testable without HTTP or a real database",
      wrongs: [
        "It makes serverless impossible",
        "Mongoose cannot be used",
        "It forbids TypeScript",
      ],
      explanation: "Separation of concerns keeps handlers thin.",
    },
  ],
};

const mongoTopics: Record<TechLevel, Topic[]> = {
  fresher: [
    {
      questionText: "What kind of database is MongoDB?",
      correct: "A document-oriented NoSQL database",
      wrongs: [
        "A purely relational SQL-only engine with tables only",
        "A CSS-in-JS library",
        "A Node.js HTTP framework",
      ],
      explanation: "Data is stored as BSON documents in collections.",
    },
    {
      questionText: "What is a collection analogous to in SQL?",
      correct: "A table (loosely)",
      wrongs: ["A foreign key", "A stored procedure only", "A view exclusively"],
      explanation: "Collections hold documents similar to rows.",
    },
    {
      questionText: "What is a document in MongoDB?",
      correct: "A BSON object, similar to JSON, with fields and values",
      wrongs: [
        "A Word file stored as a blob only",
        "A CSS stylesheet",
        "A React component",
      ],
      explanation: "Documents are the unit of storage.",
    },
    {
      questionText: "What does _id represent by default?",
      correct: "The primary key of the document, often an ObjectId",
      wrongs: [
        "The replica set name",
        "The database password",
        "The CSS class of the record",
      ],
      explanation: "Every document needs a unique _id in a collection.",
    },
    {
      questionText: "Which command inserts one document in the shell/API mental model?",
      correct: "insertOne",
      wrongs: ["SELECT INSERT", "CREATE ROW", "pushDocument"],
      explanation: "insertOne / insertMany are the write APIs.",
    },
    {
      questionText: "How do you find documents matching a filter?",
      correct: "find or findOne with a query object",
      wrongs: ["grep the data directory", "SELECT * FROM without a driver", "fs.readFile"],
      explanation: "Query objects describe matching criteria.",
    },
    {
      questionText: "What does Mongoose provide on top of the driver?",
      correct: "Schemas, models, and validation helpers",
      wrongs: [
        "A replacement for Node's event loop",
        "A React renderer",
        "A CSS framework",
      ],
      explanation: "ODM layer for Node apps.",
    },
    {
      questionText: "What is BSON?",
      correct: "MongoDB's binary JSON-like serialization format",
      wrongs: [
        "A CSS unit",
        "A React hook",
        "A Linux syscall",
      ],
      explanation: "BSON adds types like ObjectId and Date.",
    },
    {
      questionText: "Which operator matches equality in a query?",
      correct: "A field: value pair (implicit $eq)",
      wrongs: ["$join", "$css", "$react"],
      explanation: "{ name: \"Ada\" } matches that field.",
    },
    {
      questionText: "What does Compass (or similar GUIs) help you do?",
      correct: "Browse collections and run queries visually",
      wrongs: [
        "Compile TypeScript",
        "Style Tailwind",
        "Replace Next.js routing",
      ],
      explanation: "GUIs are for exploration, not required in production.",
    },
    {
      questionText: "Why do you need a connection string?",
      correct: "It tells the driver where MongoDB is and how to authenticate",
      wrongs: [
        "It compiles your React app",
        "It is the NextAuth secret",
        "It stores CSS variables",
      ],
      explanation: "mongodb:// or mongodb+srv:// URIs configure the client.",
    },
    {
      questionText: "What is an index used for?",
      correct: "Speeding up reads on indexed fields (at some write cost)",
      wrongs: [
        "Encrypting the whole disk automatically",
        "Rendering React lists",
        "Replacing TLS",
      ],
      explanation: "Indexes are B-trees (and other types) over fields.",
    },
    {
      questionText: "What does updateOne typically need?",
      correct: "A filter and an update document (often with $set)",
      wrongs: [
        "Only a CSS selector",
        "A React key",
        "An HTTP verb",
      ],
      explanation: "Updates are specified with operators like $set, $inc.",
    },
    {
      questionText: "What happens if you delete a document?",
      correct: "It is removed from the collection (subject to write concern)",
      wrongs: [
        "It remains forever as a ghost CSS rule",
        "Mongo converts it to SQL",
        "Node.js uninstalls",
      ],
      explanation: "deleteOne / deleteMany remove matching docs.",
    },
    {
      questionText: "What is a replica set?",
      correct: "A group of mongod processes that provide redundancy and failover",
      wrongs: [
        "A React Context provider",
        "A Tailwind plugin",
        "An npm workspace",
      ],
      explanation: "Production Mongo typically uses replica sets.",
    },
  ],
  junior: [
    {
      questionText: "When is embedding documents a good idea?",
      correct: "When data is accessed together and has a clear ownership/bounded size",
      wrongs: [
        "Always, instead of any references",
        "Never; always normalize like SQL 5NF",
        "Only for CSS strings",
      ],
      explanation: "Embedding vs referencing is a schema design choice.",
    },
    {
      questionText: "When are references (ObjectId links) preferable?",
      correct: "When related data is large, shared, or updated independently",
      wrongs: [
        "When you want slower joins always",
        "When documents must be 16MB of duplicated data",
        "When you do not have indexes",
      ],
      explanation: "Avoid unbounded arrays and duplication when it hurts.",
    },
    {
      questionText: "What does explain() help you see?",
      correct: "Whether a query used an index and how it scanned",
      wrongs: [
        "The React component tree",
        "CSS specificity",
        "Next.js routes",
      ],
      explanation: "Query plans diagnose collection scans vs IXSCAN.",
    },
    {
      questionText: "What is a compound index?",
      correct: "An index on multiple fields in a defined order",
      wrongs: [
        "Two databases glued together",
        "A Mongoose plugin only",
        "A CSS grid",
      ],
      explanation: "Field order must match query patterns (ESR rule).",
    },
    {
      questionText: "What does write concern 'majority' mean?",
      correct: "The write is acknowledged after a majority of replica set members persist it",
      wrongs: [
        "More than 50% of documents match",
        "The client retries 50 times",
        "Indexes cover 50% of fields",
      ],
      explanation: "Write concern trades durability vs latency.",
    },
    {
      questionText: "What is a transaction useful for in MongoDB?",
      correct: "Multi-document atomicity when a single document update is not enough",
      wrongs: [
        "Replacing all indexes",
        "CSS animations",
        "React state",
      ],
      explanation: "Transactions exist on replica sets / sharded clusters with caveats.",
    },
    {
      questionText: "What does unique: true on a Mongoose path create?",
      correct: "A unique index (once built) so duplicate values are rejected",
      wrongs: [
        "A unique React key",
        "A unique CSS class",
        "A unique TCP port",
      ],
      explanation: "Uniqueness is enforced by the index, not just the schema file.",
    },
    {
      questionText: "Why can an unbounded array in a document become a problem?",
      correct: "Documents have a 16MB limit and large arrays hurt updates and memory",
      wrongs: [
        "Arrays are illegal in BSON",
        "Mongoose cannot read arrays",
        "Indexes cannot include array fields",
      ],
      explanation: "Prefer bucketing or separate collections for high-volume lists.",
    },
    {
      questionText: "What is projection used for?",
      correct: "Returning only the fields you need to reduce payload size",
      wrongs: [
        "Projecting CSS onto the DOM",
        "Creating a new replica set",
        "Compiling TypeScript",
      ],
      explanation: "{ name: 1, _id: 0 } style projections.",
    },
    {
      questionText: "What does $lookup do?",
      correct: "Performs a left outer join-like aggregation against another collection",
      wrongs: [
        "Looks up DNS",
        "Finds React context",
        "Resolves npm packages",
      ],
      explanation: "Use sparingly; embedding or application-side joins may be better.",
    },
    {
      questionText: "How do you paginate efficiently on large collections?",
      correct: "Range queries on a unique ordered field (or cursor) rather than huge skips",
      wrongs: [
        "skip(1_000_000) as the default",
        "Load the collection into memory",
        "Use Math.random() offsets",
      ],
      explanation: "skip does not scale; keyset pagination does.",
    },
    {
      questionText: "What is a TTL index?",
      correct: "An index that expires documents after a time field is reached",
      wrongs: [
        "An index that lasts forever only",
        "A CSS animation duration",
        "A Next.js cache header",
      ],
      explanation: "Useful for sessions or ephemeral logs.",
    },
    {
      questionText: "Why should you avoid unbounded $in lists from the client?",
      correct: "Huge $in arrays can be slow and are easy to abuse",
      wrongs: [
        "$in is not a real operator",
        "Mongo rejects all $in queries",
        "It only works in SQL",
      ],
      explanation: "Validate and cap list sizes.",
    },
    {
      questionText: "What does lean() in Mongoose do?",
      correct: "Returns plain objects instead of full Mongoose documents",
      wrongs: [
        "Deletes unused indexes",
        "Enables transactions",
        "Compresses BSON on disk",
      ],
      explanation: "Lean reads are faster when you do not need document methods.",
    },
    {
      questionText: "What is the aggregation pipeline?",
      correct: "A sequence of stages ($match, $group, $project, …) that transform documents",
      wrongs: [
        "A React hook pipeline",
        "A CSS preprocessor",
        "An npm script runner",
      ],
      explanation: "Aggregations are for analytics and reshaping data.",
    },
  ],
  senior: [
    {
      questionText: "What does the ESR rule help you design?",
      correct: "Compound index field order: Equality, Sort, Range",
      wrongs: [
        "Express, SQL, Redis",
        "Embed, Shard, Replicate only as a mnemonic for CSS",
        "Event, State, Render in React",
      ],
      explanation: "Index prefix matching depends on this order.",
    },
    {
      questionText: "When is sharding appropriate?",
      correct: "When a working set or write volume exceeds what a replica set can handle",
      wrongs: [
        "For every side project with 100 documents",
        "To replace indexes",
        "Because Mongoose requires it",
      ],
      explanation: "Sharding adds operational complexity; scale vertically first when you can.",
    },
    {
      questionText: "What makes a poor shard key?",
      correct: "A monotonically increasing key that concentrates writes on one chunk",
      wrongs: [
        "A high-cardinality field that spreads writes",
        "A key used in most queries",
        "A hashed key for even distribution when queries allow it",
      ],
      explanation: "Hot shards come from low cardinality or rising _id patterns.",
    },
    {
      questionText: "What is change stream used for?",
      correct: "Watching real-time document changes (with caveats around resume tokens)",
      wrongs: [
        "Changing CSS at runtime",
        "Hot-reloading Next.js",
        "Rotating npm tokens",
      ],
      explanation: "Used for CDC-style integrations.",
    },
    {
      questionText: "How do you think about read preference?",
      correct: "Primary for strong consistency; secondaries for stale-ok read scaling",
      wrongs: [
        "Secondaries are always identical at the same millisecond",
        "Read preference replaces write concern",
        "It only applies to SQL Server",
      ],
      explanation: "Async replication means secondaries can lag.",
    },
    {
      questionText: "What is a covered query?",
      correct: "A query fully satisfied by an index without fetching documents",
      wrongs: [
        "A query wrapped in a React Error Boundary",
        "A query that uses $lookup",
        "A query over a capped collection only",
      ],
      explanation: "Projections must fit the index fields.",
    },
    {
      questionText: "Why can schema design for serverless (many short connections) need pooling care?",
      correct: "Too many connections can overwhelm mongod; reuse a cached client",
      wrongs: [
        "Mongo forbids serverless",
        "Each function must create 100 sockets",
        "Mongoose cannot run on Vercel",
      ],
      explanation: "The singleton connection pattern exists for this reason.",
    },
    {
      questionText: "What does hint() do?",
      correct: "Forces a query to use a specified index (use with care)",
      wrongs: [
        "Adds a tooltip in Compass only",
        "Creates a new index",
        "Enables sharding",
      ],
      explanation: "Usually better to fix the schema/index than hint forever.",
    },
    {
      questionText: "How do you migrate a large collection with low downtime?",
      correct: "Expand/contract with dual writes or change streams plus backfill",
      wrongs: [
        "db.dropDatabase() then restore from a laptop",
        "Edit BSON files on disk",
        "Restart Node until it works",
      ],
      explanation: "Online migrations need dual-running old/new shapes.",
    },
    {
      questionText: "What is a partial index?",
      correct: "An index that only includes documents matching a filter expression",
      wrongs: [
        "An incomplete replica set",
        "A broken unique constraint",
        "A Mongoose virtual",
      ],
      explanation: "Smaller indexes for sparse subsets (e.g. { status: \"open\" }).",
    },
    {
      questionText: "Why might $facet be expensive?",
      correct: "It can run multiple pipelines over the same documents in one round trip",
      wrongs: [
        "It is a CSS feature",
        "It always uses no indexes",
        "It only works on capped collections",
      ],
      explanation: "Powerful for dashboards; watch memory and indexes.",
    },
    {
      questionText: "What should you check before adding another index?",
      correct: "Whether an existing prefix already serves the query and the write cost",
      wrongs: [
        "Whether React Strict Mode is on",
        "Whether Tailwind JIT is enabled",
        "Whether the app uses Google login",
      ],
      explanation: "Indexes are not free on writes and RAM.",
    },
    {
      questionText: "How do retryable writes help?",
      correct: "The driver can safely retry some writes on transient network/primary failover errors",
      wrongs: [
        "They make all writes exactly-once for any custom logic",
        "They replace transactions",
        "They disable acknowledgements",
      ],
      explanation: "Still design idempotency for application-level duplicates.",
    },
    {
      questionText: "What is a working set in MongoDB terms?",
      correct: "The indexes and documents frequently accessed that you want in RAM",
      wrongs: [
        "The set of React components on a page",
        "The npm workspaces list",
        "The CSS cascade layers",
      ],
      explanation: "If the working set exceeds RAM, latency spikes.",
    },
    {
      questionText: "When would you choose a time-series collection?",
      correct: "For high-volume measurements with a time field and metadata",
      wrongs: [
        "For storing Next.js pages",
        "For CSS audit logs only",
        "For user passwords",
      ],
      explanation: "Time-series collections are optimized for that pattern.",
    },
  ],
};

const cefrTopics: Record<CefrLevel, Topic[]> = {
  A1: [
    {
      questionText: "Choose the correct sentence.",
      correct: "I am a student.",
      wrongs: ["I is a student.", "I are a student.", "I be a student."],
      explanation: "The verb be agrees with I: am.",
    },
    {
      questionText: "What is the opposite of 'hot'?",
      correct: "cold",
      wrongs: ["tall", "fast", "new"],
      explanation: "Hot and cold are basic temperature opposites.",
    },
    {
      questionText: "Complete: 'She ___ from Spain.'",
      correct: "is",
      wrongs: ["are", "am", "be"],
      explanation: "Third person singular uses is.",
    },
    {
      questionText: "Which word is a color?",
      correct: "blue",
      wrongs: ["run", "slowly", "because"],
      explanation: "Blue is a basic color word.",
    },
    {
      questionText: "Choose the correct question.",
      correct: "What is your name?",
      wrongs: ["What you name?", "How you name is?", "Name what you?"],
      explanation: "Wh-questions need an auxiliary: What is…",
    },
    {
      questionText: "Complete: 'They ___ my friends.'",
      correct: "are",
      wrongs: ["is", "am", "be"],
      explanation: "They takes are.",
    },
  ],
  A2: [
    {
      questionText: "Complete: 'I ___ to the cinema last night.'",
      correct: "went",
      wrongs: ["go", "goes", "going"],
      explanation: "Past simple of go is went.",
    },
    {
      questionText: "Choose the correct comparative.",
      correct: "This book is cheaper than that one.",
      wrongs: [
        "This book is more cheap than that one.",
        "This book is cheapest than that one.",
        "This book is cheapper than that one.",
      ],
      explanation: "Short adjectives take -er: cheaper.",
    },
    {
      questionText: "Which sentence uses the present continuous correctly?",
      correct: "She is cooking dinner now.",
      wrongs: [
        "She cooking dinner now.",
        "She cook dinner now.",
        "She is cook dinner now.",
      ],
      explanation: "am/is/are + verb-ing.",
    },
    {
      questionText: "Complete: 'There aren't ___ apples left.'",
      correct: "any",
      wrongs: ["some" /* also possible in offers, but here negative needs any */, "much" /* apples are countable */, "a"],
      explanation: "In negatives, countable plural nouns often take any.",
    },
    {
      questionText: "Choose the polite request.",
      correct: "Could you open the window, please?",
      wrongs: [
        "You open the window now!",
        "Open you the window?",
        "Must window open you?",
      ],
      explanation: "Could you… please is a standard polite request.",
    },
    {
      questionText: "Complete: 'I have lived here ___ 2019.'",
      correct: "since",
      wrongs: ["for" /* for + period */, "ago", "during"],
      explanation: "since + a starting point; for + a duration.",
    },
  ],
  B1: [
    {
      questionText: "Choose the sentence with the correct present perfect.",
      correct: "I have already finished my homework.",
      wrongs: [
        "I have already finish my homework.",
        "I already have finish my homework.",
        "I has already finished my homework.",
      ],
      explanation: "have/has + past participle.",
    },
    {
      questionText: "Which connector shows contrast?",
      correct: "although",
      wrongs: ["because", "so", "and"],
      explanation: "Although introduces a contrasting clause.",
    },
    {
      questionText: "Complete: 'If it rains tomorrow, we ___ at home.'",
      correct: "will stay",
      wrongs: ["stayed", "staying", "would stayed"],
      explanation: "First conditional: if + present, will + verb.",
    },
    {
      questionText: "Choose the correct passive sentence.",
      correct: "The letters were sent yesterday.",
      wrongs: [
        "The letters sent yesterday.",
        "The letters was send yesterday.",
        "The letters were send yesterday.",
      ],
      explanation: "Past simple passive: was/were + past participle.",
    },
    {
      questionText: "Which option is a reported-speech equivalent of 'I am tired' (he said)?",
      correct: "He said he was tired.",
      wrongs: [
        "He said he is being tired yesterday.",
        "He said he tired.",
        "He said I am tired he.",
      ],
      explanation: "Backshift: am → was in typical reporting.",
    },
    {
      questionText: "Complete: 'You should ___ more water.'",
      correct: "drink",
      wrongs: ["to drink" /* should + base */, "drinking", "drank"],
      explanation: "Modal should is followed by the base form.",
    },
  ],
  B2: [
    {
      questionText: "Choose the most natural collocation.",
      correct: "make a decision",
      wrongs: ["do a decision", "take a decide", "have deciding"],
      explanation: "English collocation: make a decision.",
    },
    {
      questionText: "Which sentence uses a mixed/second-style hypothetical most accurately?",
      correct: "If I were you, I would apply for the job.",
      wrongs: [
        "If I was you, I will apply for the job yesterday.",
        "If I am you, I applied for the job.",
        "If I would be you, I apply.",
      ],
      explanation: "Unreal present: if + past, would + base (were is traditional).",
    },
    {
      questionText: "Select the sentence with a reduced relative clause.",
      correct: "The man standing by the door is my colleague.",
      wrongs: [
        "The man which he standing by the door is my colleague.",
        "The man he stands by the door is my colleague.",
        "The man what standing by the door is my colleague.",
      ],
      explanation: "who is standing → standing.",
    },
    {
      questionText: "Complete: 'I'd rather you ___ later.'",
      correct: "came",
      wrongs: ["come" /* also heard, but exam key often past */, "to come", "coming"],
      explanation: "would rather + subject often takes a past form for preference now.",
    },
    {
      questionText: "Which linker introduces a result?",
      correct: "therefore",
      wrongs: ["whereas", "unless", "despite"],
      explanation: "Therefore signals a consequence.",
    },
    {
      questionText: "Choose the correct inversion after a negative adverbial.",
      correct: "Never have I seen such a mess.",
      wrongs: [
        "Never I have seen such a mess.",
        "Never I seen such a mess.",
        "Never have seen I such a mess.",
      ],
      explanation: "Negative adverbial + auxiliary + subject.",
    },
  ],
  C1: [
    {
      questionText: "Which sentence is most formal?",
      correct: "The committee will consider your proposal in due course.",
      wrongs: [
        "We'll get back to you whenever.",
        "The guys gonna think about it.",
        "Proposal = later maybe.",
      ],
      explanation: "in due course is a formal time hedge.",
    },
    {
      questionText: "Choose the best word: 'The findings ___ previous research.'",
      correct: "corroborate",
      wrongs: ["eat", "jump", "whisper"],
      explanation: "Corroborate means confirm with evidence.",
    },
    {
      questionText: "Which cleft sentence is grammatical?",
      correct: "It was the budget that caused the delay.",
      wrongs: [
        "It were the budget that caused the delay.",
        "It was the budget what caused the delay.",
        "It the budget caused the delay.",
      ],
      explanation: "It-cleft: It was X that…",
    },
    {
      questionText: "Select the most precise hedge.",
      correct: "The results appear to suggest a modest improvement.",
      wrongs: [
        "The results totally prove everything forever.",
        "The results are like yeah improvement.",
        "Results = win.",
      ],
      explanation: "Academic English often hedges claims.",
    },
    {
      questionText: "Complete with a participle clause: '___ the report, she left the office.'",
      correct: "Having submitted",
      wrongs: ["Have submit", "Has submitting", "Had submit"],
      explanation: "Perfect participle: Having + past participle.",
    },
    {
      questionText: "Which option uses inversion for emphasis after 'not only'?",
      correct: "Not only did she finish early, but she also helped others.",
      wrongs: [
        "Not only she finished early, but she also helped others.",
        "Not only did she finished early, but she also helped others.",
        "Not only she did finish early, but also helped.",
      ],
      explanation: "Not only + auxiliary + subject + base verb.",
    },
  ],
  C2: [
    {
      questionText: "Choose the sentence with the most precise register for a research abstract.",
      correct: "This paper examines the extent to which lexical diversity predicts outcomes.",
      wrongs: [
        "This paper kinda looks at words and stuff.",
        "We totally crushed the vocab thing.",
        "Paper = words → scores lol.",
      ],
      explanation: "C2 writing is precise, nominalised, and cautious.",
    },
    {
      questionText: "Which word best fits: 'His argument was ___ by a single counterexample.'",
      correct: "undermined",
      wrongs: ["eaten", "painted", "borrowed"],
      explanation: "Undermine = weaken the force of an argument.",
    },
    {
      questionText: "Select the most accurate use of a concessive.",
      correct: "Much as I admire the method, the sample is too small to generalise.",
      wrongs: [
        "Much as I admire the method the sample too small generalise.",
        "Although much I admire, sample small.",
        "Despite I admire method, sample small.",
      ],
      explanation: "Much as + clause is a sophisticated concessive.",
    },
    {
      questionText: "Which option shows control of information structure (end-focus)?",
      correct: "What the study reveals is a previously overlooked bias in the sampling frame.",
      wrongs: [
        "The study reveals a bias overlooked previously in sampling frame the.",
        "Reveals the study bias sampling.",
        "Bias the study what reveals sampling.",
      ],
      explanation: "Wh-clefts put new information at the end.",
    },
    {
      questionText: "Choose the subjunctive/formal alternative.",
      correct: "The chair recommended that the motion be withdrawn.",
      wrongs: [
        "The chair recommended that the motion is being withdraw.",
        "The chair recommended the motion withdrawing be.",
        "The chair recommended that the motion were been withdrawn.",
      ],
      explanation: "Mandative subjunctive: that + subject + base verb.",
    },
    {
      questionText: "Which sentence avoids a dangling modifier?",
      correct: "Walking through the archive, the historian noticed a missing folio.",
      wrongs: [
        "Walking through the archive, a missing folio was noticed.",
        "Walking through the archive, it was a missing folio.",
        "Walking through the archive, the folio missing noticed historian.",
      ],
      explanation: "The implied subject of the participle must match the main clause subject.",
    },
  ],
};

function fromTopics(
  quizType: "tech" | "cefr",
  topics: Topic[],
  extra: Partial<SeedQuestion>
): SeedQuestion[] {
  return topics.map((topic) => ({
    quizType,
    ...extra,
    ...mcq(topic.questionText, topic.correct, topic.wrongs, topic.explanation),
  }));
}

export function buildSeedQuestions(): SeedQuestion[] {
  const questions: SeedQuestion[] = [];

  (Object.keys(reactTopics) as TechLevel[]).forEach((level) => {
    questions.push(
      ...fromTopics("tech", reactTopics[level], { technology: "react", level })
    );
    questions.push(
      ...fromTopics("tech", nodeTopics[level], { technology: "nodejs", level })
    );
    questions.push(
      ...fromTopics("tech", mongoTopics[level], { technology: "mongodb", level })
    );
  });

  (Object.keys(cefrTopics) as CefrLevel[]).forEach((cefrLevel) => {
    questions.push(...fromTopics("cefr", cefrTopics[cefrLevel], { cefrLevel }));
  });

  return questions;
}
