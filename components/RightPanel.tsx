"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme, type Theme } from "@mui/material/styles";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import KeyboardReturnOutlined from "@mui/icons-material/KeyboardReturnOutlined";
import MicNoneOutlined from "@mui/icons-material/MicNoneOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import StopCircleOutlined from "@mui/icons-material/StopCircleOutlined";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";
import {
  contactProperties,
  contactTypes,
  contacts,
  conversation,
  latestMessagePreview,
  type ContactType,
  type Message,
} from "@/data/messages";
import { priceReductions } from "@/data/priceReductions";
import { squatterContractors, type Contractor } from "@/data/contractors";
import { adviceFor, conversationFor, findOffer, listAnswers, newOfferCount, newOffersByProperty, type Offer, type OfferAdvice, type OfferProperty } from "@/data/offers";
import { subject } from "@/data/property";
import NoteHotspot from "@/components/notes/NoteHotspot";
import { useCalculator } from "@/components/calculator/CalculatorProvider";

const propertyPath = "/price-reductions/8110-n-10th-st";
const calculatorChip = "Open price calculator";

type Tab = "ask" | "message";
type Stage = 1 | 2 | 3 | 4;

const attention = ["View new offers", "Price reduction", "Respond to urgent messages"];
const suggested = ["Show a list of active contractors", "View most recent Messages", "View recent comps in your market"];

const propertySuggested = ["Why $412K?", "Show only sold comps", "Draft a reply to Shoshana"];

// Chips that start a question: clicking one puts its question in the Ask box
const chipQuestions: Record<string, string> = {
  "Price reduction": "Which price reduction tasks need my immediate attention?",
  "Show a list of active contractors": "Which contractors do I know that can handle squatters in the Atlanta market?",
};

const priceReductionAttention = ["4 high-confidence ready to approve", "4 Tampa listings affected by comp drop"];
const priceReductionSuggested = [
  "Which has the highest holding cost?",
  "Compare the Tampa listings",
  "Why is 8110 N 10th St ranked first?",
];

function LabelChip({ label, bg, onClick }: { label: string; bg: string; onClick?: () => void }) {
  return (
    <Chip
      label={label}
      size="small"
      onClick={onClick}
      sx={(t) => ({
        bgcolor: bg,
        color: "text.primary",
        height: "auto",
        px: 0,
        py: 0.5,
        borderRadius: `${t.custom.radius.pill}px`,
        "&:hover": { bgcolor: bg },
        "& .MuiChip-label": { ...t.typography.caption, px: 1, py: 0 },
      })}
    />
  );
}

function ChipList({
  title,
  chips,
  color,
  onChipClick,
  isAskable = (label) => Boolean(chipQuestions[label]),
}: {
  title: string;
  chips: string[];
  color: "pink" | "teal";
  onChipClick?: (label: string) => void;
  /** Which chips start a question when clicked */
  isAskable?: (label: string) => boolean;
}) {
  const bg = useTheme().palette.accent[color].light;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
        {chips.map((label) => (
          <LabelChip key={label} label={label} bg={bg} onClick={onChipClick && isAskable(label) ? () => onChipClick(label) : undefined} />
        ))}
      </Box>
    </Box>
  );
}

function TabSwitch({ value, onChange }: { value: Tab; onChange: (v: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "ask", label: "Ask" },
    { id: "message", label: "Message" },
  ];
  return (
    <Box role="tablist" sx={(t) => ({ display: "flex", gap: 1, p: 0.5, mb: -2, bgcolor: t.palette.tabTrack, borderRadius: "24px" })}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <ButtonBase
            key={tab.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            sx={(t) => ({
              flex: 1,
              px: 2,
              py: 1,
              borderRadius: "24px",
              bgcolor: selected ? "common.white" : t.palette.tabTrack,
              color: selected ? "text.secondary" : "text.primary",
              ...t.typography.body1,
              fontWeight: selected ? t.typography.fontWeightMedium : t.typography.fontWeightRegular,
            })}
          >
            {tab.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function LatestMessage({ onOpen }: { onOpen: () => void }) {
  return (
    <ButtonBase
      onClick={onOpen}
      aria-label="Open conversation with the seller"
      sx={(t) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        p: 2,
        textAlign: "left",
        border: 1,
        borderColor: "divider",
        borderRadius: `${t.custom.radius.md}px`,
      })}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Latest message
      </Typography>
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {latestMessagePreview}
      </Typography>
    </ButtonBase>
  );
}

function PropertyAskView({ onOpenConversation }: { onOpenConversation: () => void }) {
  const [question, setQuestion] = useState("");
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ color: "text.secondary" }}>
          {subject.street}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Seller: {subject.seller}
        </Typography>
      </Box>
      <LatestMessage onOpen={onOpenConversation} />
      <ChipList title="Suggested for you" chips={propertySuggested} color="teal" />
      <AskBox value={question} onChange={setQuestion} />
    </>
  );
}

function AskBox({
  value,
  onChange,
  inputRef,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  /** Called when the person presses Enter or the send icon. Without it, Enter just adds a new line. */
  onSubmit?: () => void;
}) {
  return (
    <Box
      sx={(t) => ({
        border: 1,
        borderColor: "divider",
        borderRadius: `${t.custom.radius.md}px`,
        height: 140,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      })}
    >
      <InputBase
        multiline
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (onSubmit && e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onSubmit();
          }
        }}
        inputRef={inputRef}
        placeholder="Ask a question"
        slotProps={{ input: { "aria-label": "Ask a question" } }}
        sx={(t) => ({ ...t.typography.body2, alignItems: "flex-start", p: 0, flex: 1, overflow: "auto", "& textarea::placeholder": { color: t.palette.text.disabled, opacity: 1 } })}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, color: "text.secondary" }}>
        <SettingsOutlined sx={{ fontSize: 18 }} />
        <MicNoneOutlined sx={{ fontSize: 18 }} />
        {onSubmit ? (
          <IconButton aria-label="Send question" size="small" disabled={!value.trim()} onClick={onSubmit} sx={{ p: 0, color: "inherit" }}>
            <KeyboardReturnOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <KeyboardReturnOutlined aria-label="Press enter to send" sx={{ fontSize: 18 }} />
        )}
      </Box>
    </Box>
  );
}

const isPriceReductionQuestion = (q: string) => /price[- ]?reduction/i.test(q);

type Answer = { id: number; question: string; kind: "priceReduction" | "contractors" | "text"; text?: string };

function PriceReductionAnswer() {
  const total = priceReductions.length;
  const pending = priceReductions.filter((r) => r.pending).length;
  const high = priceReductions.filter((r) => r.confidence === "High").length;
  return (
    <Typography variant="body2" sx={{ color: "text.primary" }}>
      There are {total} properties in the queue for price reduction. {pending} are pending your approval, and {high} can be approved now with high
      confidence.{" "}
      <Box component={NextLink} href="/price-reductions" sx={{ color: "primary.main", fontWeight: "fontWeightMedium" }}>
        Click here to see the list.
      </Box>
    </Typography>
  );
}

function ContractorList({ contractors }: { contractors: Contractor[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {contractors.map((c) => (
        <Box key={c.email}>
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: "fontWeightMedium" }}>
            {c.company}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {c.contact}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {c.phone}
          </Typography>
          <Box component="a" href={`mailto:${c.email}`} sx={{ ...bodyLinkSx, display: "block", overflowWrap: "anywhere" }}>
            {c.email}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

const bodyLinkSx = { typography: "body2", color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } } as const;

function ContractorAnswer() {
  const [showMore, setShowMore] = useState(false);
  // A random 3 for this answer; the other 3 appear under "View more"
  const [{ first, more }] = useState(() => {
    const shuffled = [...squatterContractors].sort(() => Math.random() - 0.5);
    return { first: shuffled.slice(0, 3), more: shuffled.slice(3) };
  });
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        Here are 3 contractors in your network who can handle squatters in the Atlanta market.
      </Typography>
      <ContractorList contractors={first} />
      {showMore && <ContractorList contractors={more} />}
      {!showMore && (
        <Box>
          <Button size="small" onClick={() => setShowMore(true)} sx={{ minWidth: 0, px: 1, py: 0.25, ml: -1 }}>
            View more
          </Button>
        </Box>
      )}
    </Box>
  );
}

function AskAnswer({ answer, onClear }: { answer: Answer; onClear: () => void }) {
  const { question } = answer;
  return (
    <Box
      role="status"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        animation: "askAnswerIn 400ms ease-out",
        "@keyframes askAnswerIn": { from: { opacity: 0, transform: "translateY(-4px)" }, to: { opacity: 1, transform: "none" } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {question}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        <AutoAwesomeOutlined sx={{ fontSize: 16, mt: "2px", color: "primary.main" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {answer.kind === "priceReduction" ? (
            <PriceReductionAnswer />
          ) : answer.kind === "contractors" ? (
            <ContractorAnswer />
          ) : (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {answer.text}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={onClear} sx={{ minWidth: 0, px: 1, py: 0.25, ml: -1, color: "text.secondary" }}>
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function PendingOffers() {
  const bg = useTheme().palette.accent.pink.light;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Pending Offers
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {newOffersByProperty.map(({ property, count }) => (
          <Box key={property.slug} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {property.street}
            </Typography>
            <LabelChip label={String(count)} bg={bg} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function AskView({ onOpenConversation }: { onOpenConversation: () => void }) {
  const pathname = usePathname();
  const [question, setQuestion] = useState("");
  const askRef = useRef<HTMLTextAreaElement>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const askWrap = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTyping = () => {
    if (typingTimer.current) clearInterval(typingTimer.current);
    typingTimer.current = null;
  };
  useEffect(() => stopTyping, []);

  // Scroll only the panel (not the page) so the Ask box and the newest answer under it are in view
  const scrollToAsk = useCallback(() => {
    const wrap = askWrap.current;
    const panel = wrap?.closest("aside");
    if (!wrap || !panel) return;
    const top = panel.scrollTop + (wrap.getBoundingClientRect().top - panel.getBoundingClientRect().top) - 24;
    panel.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);
  const previousCount = useRef(0);
  useEffect(() => {
    if (answers.length > previousCount.current) scrollToAsk();
    previousCount.current = answers.length;
  }, [answers.length, scrollToAsk]);

  // The question types itself in quickly instead of appearing all at once (instantly with reduced motion)
  // On the offers pages the Ask box answers offer questions from the sample offer data
  const offerMatch = pathname.startsWith("/offers/") ? findOffer(pathname.split("/")[2] ?? "") : undefined;
  const advice: OfferAdvice | null = offerMatch ? adviceFor(offerMatch.property, offerMatch.offer) : null;
  const offerAnswers: Record<string, string> | null = pathname === "/offers" ? listAnswers() : (advice?.answers ?? null);
  const askText = (label: string) => (offerAnswers ? (label in offerAnswers ? label : undefined) : chipQuestions[label]);
  const askAbout = (label: string) => {
    const text = askText(label);
    if (!text) return;
    stopTyping();
    askRef.current?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setQuestion(text);
      return;
    }
    let length = 0;
    setQuestion("");
    typingTimer.current = setInterval(() => {
      length += 1;
      setQuestion(text.slice(0, length));
      if (length >= text.length) stopTyping();
    }, 14);
  };
  const submit = () => {
    const text = question.trim();
    if (!text) return;
    stopTyping();
    // Newest answer goes on top, directly under the input
    let answer: Answer;
    if (offerAnswers) {
      const known = Object.keys(offerAnswers).find((q) => q.toLowerCase() === text.toLowerCase());
      answer = {
        id: Date.now(),
        question: text,
        kind: "text",
        text: known ? offerAnswers[known] : "I can answer a few questions about these offers in this sample. Try one of the suggestions above.",
      };
    } else {
      answer = { id: Date.now(), question: text, kind: isPriceReductionQuestion(text) ? "priceReduction" : "contractors" };
    }
    setAnswers((prev) => [answer, ...prev]);
    setQuestion("");
  };
  if (pathname === propertyPath) return <PropertyAskView onOpenConversation={onOpenConversation} />;
  const onPriceReductions = pathname === "/price-reductions";
  const onOffersList = pathname === "/offers";
  const offerChipsAskable = (label: string) => Boolean(offerAnswers && label in offerAnswers);
  return (
    <>
      {onOffersList ? (
        <>
          <Typography variant="h2" sx={{ color: "text.secondary" }}>
            You have {newOfferCount} new offers
          </Typography>
          <PendingOffers />
          <ChipList title="Suggested for you" chips={Object.keys(offerAnswers ?? {})} color="teal" onChipClick={askAbout} isAskable={offerChipsAskable} />
        </>
      ) : advice ? (
        <>
          <Typography variant="h2" sx={{ color: "text.secondary" }}>
            {advice.headline}
          </Typography>
          <ChipList title="Suggested for you" chips={Object.keys(advice.answers)} color="teal" onChipClick={askAbout} isAskable={offerChipsAskable} />
        </>
      ) : (
        <>
          <Typography variant="h2" sx={{ color: "text.secondary" }}>
            {onPriceReductions ? `${priceReductions.length} suggested price reductions` : "Welcome back, Michael."}
          </Typography>
          <ChipList
            title={onPriceReductions ? "Needs your attention" : "Needs your immediate attention"}
            chips={onPriceReductions ? priceReductionAttention : attention}
            color="pink"
            onChipClick={askAbout}
          />
          <ChipList title="Suggested for you" chips={onPriceReductions ? priceReductionSuggested : suggested} color="teal" onChipClick={askAbout} />
        </>
      )}
      <Box ref={askWrap} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <AskBox
          value={question}
          onChange={(v) => {
            stopTyping();
            setQuestion(v);
          }}
          inputRef={askRef}
          onSubmit={submit}
        />
        {answers.map((a) => (
          <AskAnswer key={a.id} answer={a} onClear={() => setAnswers((prev) => prev.filter((x) => x.id !== a.id))} />
        ))}
        {/* Room below the last element so the fixed design notes button never covers it */}
        <Box sx={{ mb: answers.length ? 13 : 0 }}>
          {answers.length > 0 && (
            <Button size="small" onClick={() => setAnswers([])} sx={{ minWidth: 0, px: 1, py: 0.25, ml: -1, color: "text.secondary" }}>
              Clear all
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}

function PickerField({
  options,
  value,
  placeholder,
  onChange,
  label,
  listOnOpen = true,
}: {
  options: string[];
  value: string | null;
  placeholder: string;
  onChange: (v: string | null) => void;
  label: string;
  listOnOpen?: boolean;
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Autocomplete
      fullWidth
      size="small"
      options={options}
      value={value}
      onChange={(_, v) => onChange(v)}
      openOnFocus={listOnOpen}
      open={open && (listOnOpen || input.length > 0)}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      forcePopupIcon={listOnOpen}
      noOptionsText="No matches"
      getOptionLabel={(o) => o}
      renderOption={(props, option) => {
        const { key, ...rest } = props as typeof props & { key: string };
        return (
          <Box component="li" key={key} {...rest}>
            {option.replace(", ", " ")}
          </Box>
        );
      }}
      slotProps={{
        popper: { sx: { width: "max-content !important", minWidth: 316 } },
        paper: { sx: (t: Theme) => ({ mt: 1, boxShadow: 1, borderRadius: `${t.custom.radius.md}px` }) },
        listbox: { sx: { py: 1, "& .MuiAutocomplete-option": { minHeight: 36, px: 2, py: 0.75, typography: "body2", color: "text.primary", whiteSpace: "nowrap" } } },
      }}
      renderInput={(params) => <TextField
          {...params}
          placeholder={placeholder}
          slotProps={{ ...params.slotProps, htmlInput: { ...params.slotProps.htmlInput, "aria-label": label } }}
        />}
    />
  );
}

function ContactTypeRadios({ value, onChange }: { value: ContactType | null; onChange: (v: ContactType) => void }) {
  return (
    <RadioGroup value={value ?? ""} onChange={(e) => onChange(e.target.value as ContactType)} sx={{ gap: 2 }}>
      {contactTypes.map((type) => (
        <FormControlLabel
          key={type}
          value={type}
          control={<Radio sx={{ p: 0, mr: 1 }} />}
          label={type}
          sx={{ m: 0, "& .MuiFormControlLabel-label": { typography: "body1", color: "text.primary" } }}
        />
      ))}
    </RadioGroup>
  );
}

function Alert({ bg, iconColor, lead, text, leadWeight }: { bg: string; iconColor: string; lead: string; text: string; leadWeight: number | string }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", px: 1.5, py: 1, borderRadius: "4px", bgcolor: bg }}>
      <Box sx={{ py: 0.75, display: "flex", gap: 1, alignItems: "flex-start", typography: "body2", color: "text.primary" }}>
        <InfoOutlined sx={{ fontSize: 16, mt: "2px", color: iconColor }} />
        <Box component="span">
          <Box component="span" sx={{ fontWeight: leadWeight }}>
            {lead}{" "}
          </Box>
          {text}
        </Box>
      </Box>
    </Box>
  );
}

function MessageLog({ message }: { message: Message }) {
  const { from } = message;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "text.primary" }}>
        <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium" }}>
          {message.date}
        </Typography>
        <Typography variant="caption">{message.time}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={(t) => ({
                width: 24,
                height: 24,
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: from.isMe ? t.palette.accent.purple.main : "primary.main",
                color: "common.white",
                ...t.typography.caption,
                fontWeight: t.typography.fontWeightMedium,
              })}
            >
              {from.initials}
            </Box>
            <Typography
              variant="body1"
              sx={{ color: from.isMe ? "text.secondary" : "primary.main", fontWeight: from.isMe ? "fontWeightMedium" : "fontWeightRegular" }}
            >
              {from.name}
            </Typography>
          </Box>
          <LabelChipRole role={from.role} />
        </Box>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {message.body}
        </Typography>
      </Box>
    </Box>
  );
}

function LabelChipRole({ role }: { role: "DM" | "Seller" }) {
  const t = useTheme();
  const bg = role === "DM" ? t.palette.accent.purple.light : t.palette.primary.light;
  return <LabelChip label={role} bg={bg} />;
}

function formatNow() {
  const d = new Date();
  const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

type ConversationConfig = {
  contactType: ContactType;
  contact: string;
  property: string;
  /** Summary text, plus anything shown under it such as lists of suggestions */
  summary: React.ReactNode;
  agreement: string;
  next: string;
  /** Suggested actions. A draft is written into the message box when the action is clicked. */
  actions: { label: string; draft?: string }[];
  /** Newest first */
  messages: Message[];
  sendLabel: string;
  /** Hide the suggested actions */
  hideActions?: boolean;
  /** When set, a button under the bars writes this message into the message box so it can be edited and sent */
  composeDraft?: string;
  /** Green and yellow bars with a title above each and bullets inside. Used instead of the Agreement and Next bars. */
  bars?: { title: string; items: string[]; tone: "success" | "warning" }[];
  /** A tighter layout that keeps the message box and send button on screen without scrolling */
  compact?: boolean;
};

const defaultConversation: ConversationConfig = {
  contactType: conversation.contactType,
  contact: conversation.contact,
  property: conversation.property,
  summary: conversation.summary,
  agreement: conversation.agreement,
  next: conversation.next,
  actions: conversation.suggestedActions.map((label) => ({ label })),
  messages: conversation.messages,
  sendLabel: "Send",
};

function BulletBar({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" }) {
  const t = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", px: 1.5, py: 1, borderRadius: "4px", bgcolor: t.palette[tone].light }}>
        <InfoOutlined sx={{ fontSize: 16, mt: "2px", color: t.palette[tone].main }} />
        <Box component="ul" sx={{ m: 0, pl: 2, flex: 1, display: "flex", flexDirection: "column", gap: 0.5, typography: "body2", color: "text.primary" }}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function Conversation({ config = defaultConversation, onSwitchContact }: { config?: ConversationConfig; onSwitchContact?: () => void }) {
  const t = useTheme();
  const { openCalculator } = useCalculator();
  const [messages, setMessages] = useState<Message[]>(config.messages);
  const [draft, setDraft] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    const { date, time } = formatNow();
    setMessages((prev) => [
      { id: `m-${Date.now()}`, date, time, from: { name: "Yoomi C.", initials: "YC", role: "DM", isMe: true }, body },
      ...prev,
    ]);
    setDraft("");
  };

  const runAction = (action: { label: string; draft?: string }) => {
    if (action.label === calculatorChip) return openCalculator();
    if (action.draft) {
      setDraft(action.draft);
      composerRef.current?.focus();
    }
  };

  const compact = Boolean(config.compact);

  const composer = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: compact ? 1.5 : 2 }}>
      <TextField
        multiline
        minRows={compact ? 3 : 4}
        maxRows={8}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        inputRef={composerRef}
        placeholder={`You are messaging ${config.contact} (${config.contactType})`}
        slotProps={{ htmlInput: { "aria-label": "Message" } }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
        <Button onClick={() => setDraft("")} sx={{ minWidth: 0, px: 1 }}>
          Clear
        </Button>
        <Button variant="contained" onClick={send} disabled={!draft.trim()} sx={{ whiteSpace: "nowrap", px: 1.5 }}>
          {config.sendLabel}
        </Button>
      </Box>
    </Box>
  );

  const history = (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {messages.map((m) => (
          <MessageLog key={m.id} message={m} />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", color: "text.secondary" }}>
        <MoreHorizOutlined />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, py: 0.5, color: "text.secondary" }}>
        <StopCircleOutlined />
        <Typography variant="caption" sx={{ fontWeight: "fontWeightMedium" }}>
          End of conversation
        </Typography>
      </Box>
    </>
  );

  const summaryHeading = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <AutoAwesomeOutlined sx={{ color: "primary.main" }} />
      <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium" }}>
        Summary
      </Typography>
    </Box>
  );

  const createMessage = config.composeDraft ? (
    <Box>
      <Button
        size="small"
        onClick={() => {
          setDraft(config.composeDraft ?? "");
          composerRef.current?.focus();
        }}
        sx={{ minWidth: 0, px: 1, py: 0.25, ml: -1 }}
      >
        Create message with these suggestions
      </Button>
    </Box>
  ) : null;

  const bannerBlock = config.bars ? (
    <>
      {config.bars.map((bar) => (
        <BulletBar key={bar.title} {...bar} />
      ))}
      {createMessage}
    </>
  ) : (
    <>
      <Alert
        bg={t.palette.success.light}
        iconColor={t.palette.success.main}
        lead="Agreement:"
        text={config.agreement}
        leadWeight={t.typography.fontWeightMedium as number}
      />
      <Alert
        bg={t.palette.warning.light}
        iconColor={t.palette.warning.main}
        lead="Next:"
        text={config.next}
        leadWeight={t.typography.fontWeightMedium as number}
      />
    </>
  );

  if (compact) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LabelChip label={config.contactType} bg={t.palette.primary.light} />
          <Typography variant="h3" sx={{ color: "text.secondary" }}>
            {config.contact}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {summaryHeading}
          {typeof config.summary === "string" ? (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {config.summary}
            </Typography>
          ) : (
            config.summary
          )}
          {bannerBlock}
        </Box>
        {composer}
        <Divider />
        {history}
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <LabelChip label={config.contactType} bg={t.palette.primary.light} />
          {onSwitchContact && (
            <Button size="small" onClick={onSwitchContact} sx={{ px: 1, py: 0.25 }}>
              Switch contact
            </Button>
          )}
        </Box>
        <Typography variant="h3" sx={{ color: "text.secondary" }}>
          {config.contact}
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          disableClearable
          options={contactProperties[config.contact] ?? [config.property]}
          value={config.property}
          readOnly
          renderInput={(params) => (
            <TextField
              {...params}
              slotProps={{ ...params.slotProps, htmlInput: { ...params.slotProps.htmlInput, "aria-label": "Property" } }}
              sx={{ "& input": { color: "text.disabled" } }}
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 2 }}>
          <Box>
            {summaryHeading}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeOutlined sx={{ fontSize: 16 }} />
              <Typography variant="body2">Updated 2m ago</Typography>
            </Box>
          </Box>
          {typeof config.summary === "string" ? (
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {config.summary}
            </Typography>
          ) : (
            config.summary
          )}
          {bannerBlock}
          {!config.hideActions && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
              <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium" }}>
                Suggested actions:
              </Typography>
              {config.actions.map((action) => (
                <LabelChip key={action.label} label={action.label} bg={t.palette.accent.teal.light} onClick={action.label === calculatorChip || action.draft ? () => runAction(action) : undefined} />
              ))}
            </Box>
          )}
        </Box>
        <Divider />
        {/* The message box sits above the history so the newest message and the reply field stay together */}
        {composer}
        {history}
      </Box>
    </>
  );
}

/** The seller conversation for an offer, with the recommendation under Summary */
function OfferConversationView({ property, offer }: { property: OfferProperty; offer: Offer }) {
  const convo = conversationFor(property, offer);
  const config: ConversationConfig = {
    contactType: convo.contactType,
    contact: convo.contact,
    property: convo.property,
    summary: convo.summary,
    agreement: convo.agreement,
    next: convo.next,
    // The recommendation sits in the bars: what works in the green one, what to do about the rest in the yellow one
    bars: [
      { title: convo.strengthsTitle, items: convo.strengths, tone: "success" },
      { title: convo.negotiateTitle, items: convo.negotiate, tone: "warning" },
    ],
    actions: convo.actions,
    hideActions: true,
    compact: true,
    composeDraft: convo.draft,
    messages: convo.messages,
    sendLabel: convo.sendLabel,
  };
  return <Conversation key={offer.number} config={config} />;
}

function MessageView({ startInConversation }: { startInConversation: boolean }) {
  const [stage, setStage] = useState<Stage>(startInConversation ? 4 : 1);
  const [type, setType] = useState<ContactType | null>(startInConversation ? conversation.contactType : null);
  const [contact, setContact] = useState<string | null>(startInConversation ? conversation.contact : null);

  const reset = () => {
    setStage(1);
    setType(null);
    setContact(null);
  };

  if (stage === 4 && contact) return <Conversation onSwitchContact={reset} />;

  const heading = stage === 3 ? "Which property?" : "Who would you like to Message with?";
  return (
    <>
      <Typography variant="h2" sx={{ color: "text.secondary" }}>
        {heading}
      </Typography>
      <ContactTypeRadios
        value={type}
        onChange={(v) => {
          setType(v);
          setContact(null);
          setStage(2);
        }}
      />
      {stage >= 2 && type && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
          <PickerField
            label="Contact"
            listOnOpen={false}
            options={contacts[type]}
            value={contact}
            placeholder="Type name"
            onChange={(v) => {
              setContact(v);
              setStage(v ? 3 : 2);
            }}
          />
          <Button size="small" startIcon={<PersonAddAltOutlined sx={{ fontSize: 16 }} />} sx={{ px: 1, py: 0.25 }}>
            Contact
          </Button>
        </Box>
      )}
      {stage === 3 && contact && (
        <PickerField
          label="Property"
          options={contactProperties[contact] ?? []}
          value={null}
          placeholder="Select property"
          onChange={(v) => v && setStage(4)}
        />
      )}
    </>
  );
}

export default function RightPanel() {
  const pathname = usePathname();
  const onOfferPage = pathname.startsWith("/offers/");
  const offerMatch = onOfferPage ? findOffer(pathname.split("/")[2] ?? "") : undefined;
  // A review offer page opens on the Message tab; leaving it returns to Ask
  const [tab, setTab] = useState<Tab>(onOfferPage ? "message" : "ask");
  const wasOnOfferPage = useRef(onOfferPage);
  useEffect(() => {
    if (onOfferPage !== wasOnOfferPage.current) setTab(onOfferPage ? "message" : "ask");
    wasOnOfferPage.current = onOfferPage;
  }, [onOfferPage]);
  const [openedFromPreview, setOpenedFromPreview] = useState(false);
  const changeTab = (next: Tab) => {
    setOpenedFromPreview(false);
    setTab(next);
  };
  const openConversation = () => {
    setOpenedFromPreview(true);
    setTab("message");
  };
  return (
    // The wrapper spans the panel's grid row so the sticky panel stops where that row ends
    <Box sx={{ gridColumn: 2, gridRow: 1, alignSelf: "stretch" }}>
      {/* The sticky frame holds the panel and its design note pin, so the pin can sit on the panel's left edge without being clipped by the panel's own scrolling */}
      <Box sx={(t) => ({ position: "sticky", top: 16, width: t.custom.layout.rightPanelWidth })}>
        <NoteHotspot id={tab === "ask" ? "ask-tab" : "message-tab"} top={52} left={tab === "ask" ? -4 : "calc(100% - 16px)"} />
        <Box
          component="aside"
          sx={(t) => ({
            maxHeight: "calc(100vh - 32px)",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: `${t.custom.radius.md}px`,
            boxShadow: 1,
            px: 3,
            py: 5,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          })}
        >
          <TabSwitch value={tab} onChange={changeTab} />
          {tab === "ask" ? (
            <AskView onOpenConversation={openConversation} />
          ) : offerMatch ? (
            <OfferConversationView property={offerMatch.property} offer={offerMatch.offer} />
          ) : (
            <MessageView startInConversation={openedFromPreview} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
