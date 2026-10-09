"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
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
import { subject } from "@/data/property";
import { useCalculator } from "@/components/calculator/CalculatorProvider";

const propertyPath = "/price-reductions/8110-n-10th-st";
const calculatorChip = "Open price calculator";

type Tab = "ask" | "message";
type Stage = 1 | 2 | 3 | 4;

const attention = ["View new offers", "Price reduction", "Respond to urgent messages"];
const suggested = ["Show a list of active contractors", "View most recent Messages", "View recent comps in your market"];

const propertySuggested = ["Why $412K?", "Show only sold comps", "Draft a reply to Shoshana"];

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

function ChipList({ title, chips, color }: { title: string; chips: string[]; color: "pink" | "teal" }) {
  const bg = useTheme().palette.accent[color].light;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
        {chips.map((label) => (
          <LabelChip key={label} label={label} bg={bg} />
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
      <AskBox />
    </>
  );
}

function AskBox() {
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
      <Typography variant="body2" sx={{ color: "text.disabled" }}>
        Ask a question
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, color: "text.secondary" }}>
        <SettingsOutlined sx={{ fontSize: 18 }} />
        <MicNoneOutlined sx={{ fontSize: 18 }} />
        <KeyboardReturnOutlined aria-label="Press enter to send" sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  );
}

function AskView({ onOpenConversation }: { onOpenConversation: () => void }) {
  const pathname = usePathname();
  if (pathname === propertyPath) return <PropertyAskView onOpenConversation={onOpenConversation} />;
  const onPriceReductions = pathname === "/price-reductions";
  return (
    <>
      <Typography variant="h2" sx={{ color: "text.secondary" }}>
        {onPriceReductions ? `${priceReductions.length} suggested price reductions` : "Welcome back, Michael."}
      </Typography>
      <ChipList
        title={onPriceReductions ? "Needs your attention" : "Needs your immediate attention"}
        chips={onPriceReductions ? priceReductionAttention : attention}
        color="pink"
      />
      <ChipList title="Suggested for you" chips={onPriceReductions ? priceReductionSuggested : suggested} color="teal" />
      <AskBox />
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

function Conversation({ onSwitchContact }: { onSwitchContact: () => void }) {
  const t = useTheme();
  const { openCalculator } = useCalculator();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [draft, setDraft] = useState("");

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    const { date, time } = formatNow();
    setMessages((prev) => [
      { id: `m-${Date.now()}`, date, time, from: { name: "Me", initials: "MW", role: "DM", isMe: true }, body },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <LabelChip label={conversation.contactType} bg={t.palette.primary.light} />
          <Button size="small" onClick={onSwitchContact} sx={{ px: 1, py: 0.25 }}>
            Switch contact
          </Button>
        </Box>
        <Typography variant="h3" sx={{ color: "text.secondary" }}>
          {conversation.contact}
        </Typography>
        <Autocomplete
          fullWidth
          size="small"
          disableClearable
          options={contactProperties[conversation.contact]}
          value={conversation.property}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesomeOutlined sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium" }}>
                Summary
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeOutlined sx={{ fontSize: 16 }} />
              <Typography variant="body2">Updated 2m ago</Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {conversation.summary}
          </Typography>
          <Alert
            bg={t.palette.success.light}
            iconColor={t.palette.success.main}
            lead="Agreement:"
            text={conversation.agreement}
            leadWeight={t.typography.fontWeightMedium as number}
          />
          <Alert
            bg={t.palette.warning.light}
            iconColor={t.palette.warning.main}
            lead="Next:"
            text={conversation.next}
            leadWeight={t.typography.fontWeightMedium as number}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
            <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium" }}>
              Suggested actions:
            </Typography>
            {conversation.suggestedActions.map((label) => (
              <LabelChip
                key={label}
                label={label}
                bg={t.palette.accent.teal.light}
                onClick={label === calculatorChip ? openCalculator : undefined}
              />
            ))}
          </Box>
        </Box>
        <Divider />
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            multiline
            minRows={4}
            maxRows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`You are messaging ${conversation.contact} (${conversation.contactType})`}
            slotProps={{ htmlInput: { "aria-label": "Message" } }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, height: 64 }}>
            <Button onClick={() => setDraft("")} sx={{ px: 1.5, alignSelf: "flex-start" }}>
              Clear
            </Button>
            <Button variant="contained" onClick={send} disabled={!draft.trim()} sx={{ alignSelf: "flex-start" }}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
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
  const [tab, setTab] = useState<Tab>("ask");
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
      <Box
        component="aside"
        sx={(t) => ({
          width: t.custom.layout.rightPanelWidth,
          position: "sticky",
          top: 16,
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
        {tab === "ask" ? <AskView onOpenConversation={openConversation} /> : <MessageView startInConversation={openedFromPreview} />}
      </Box>
    </Box>
  );
}
