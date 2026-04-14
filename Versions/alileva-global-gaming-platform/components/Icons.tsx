
import React from 'react';

type IconProps = { className?: string };

export const AnalyticsIcon: React.FC<IconProps> = (props) => (
  <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
export const UsersIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606 11.955 11.955 0 019 2.606c.342-1.616.342-3.21 0-4.688A12.02 12.02 0 0017.618 7.984z" /></svg>
);
export const ChatBubbleIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
export const CogIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
export const DollarSignIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01V8m0 0h.01M12 16c-1.11 0-2.08-.402-2.599-1M12 16v1m0-1v-.01M12 18v1m0 1v1m0-2.01V16m0 0h-.01" /></svg>
);
export const GlobeIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.586-.586a2 2 0 012.828 0l2.121 2.121a2 2 0 010 2.828l-2.121 2.121a2 2 0 01-2.828 0l-.586-.586M15 4h.01M15 19h.01" /></svg>
);
export const HandshakeIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1m12-4V9a2 2 0 00-2-2H8a2 2 0 00-2 2v1m12 0l-4-4m-4 4l-4-4" /></svg>
);
export const RocketIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
export const FeedbackIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
);
export const GameControllerIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={props.className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25l9-5.25" />
    </svg>
);


// Game Icons
export const ChessIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22a2 2 0 0 0 2-2v-2h-4v2a2 2 0 0 0 2 2zM6 18V9.828a2 2 0 0 1 .586-1.414l4-4a.4.4 0 0 1 .565 0l4 4a2 2 0 0 1 .586 1.414V18zM4 18h16"></path></svg>;
export const CheckersIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z"></path></svg>;
export const MonopolyIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 21V11.833a2 2 0 0 1 .458-1.232l3-4.5A2 2 0 0 1 9.125 5h5.75a2 2 0 0 1 1.667.901l3 4.5A2 2 0 0 1 20 11.833V21M4 21h16M7 13h2m6 0h-2m-2-4v8"></path></svg>;
export const PokerIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16v16H4zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 18l-3-3M6 18l3-3"></path></svg>;
export const ScrabbleIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v18H3zM9 9v6m-2-3h4m4-3v6m-2-3h4"></path></svg>;
export const LudoIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M12 3v18M12 12l-7 7M12 12l7 7M12 12l-7-7M12 12l7-7"></path></svg>;
export const UnoIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3h8v18H8zM12 8a4 4 0 0 1 0 8"></path></svg>;
export const TetrisIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h4v4H6zM10 7h4v4h-4zM14 11h4v4h-4zM6 15h4v4H6z"></path></svg>;
export const SudokuIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"></path></svg>;
export const SolitaireIcon: React.FC<IconProps> = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h4M5 5v4m8-4h4m-2-2v4m-2 6h4m-2-2v4m-8 2h4m-2-2v4"></path></svg>;
