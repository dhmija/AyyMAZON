"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchProducts } from "@/lib/products";
import Image from "next/image";

const STORAGE_KEY = "amazon_recent_searches";
const MAX_RECENT = 5;

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (!query.trim()) return;
  const prev = getRecent().filter((q) => q !== query);
  const next = [query, ...prev].slice(0, MAX_RECENT);
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function removeRecent(query: string) {
  const next = getRecent().filter((q) => q !== query);
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export interface SearchCategory {
  label: string;
  value: string;
}

const DEFAULT_CATEGORIES: SearchCategory[] = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & Kitchen", value: "home-kitchen" },
  { label: "Books", value: "books" },
  { label: "Gaming", value: "gaming" },
  { label: "Mobiles", value: "mobiles" },
  { label: "Computers", value: "computers" },
];

export interface SearchBarProps {
  /** Initial search query */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Categories for the dropdown (default: All, Electronics, etc.) */
  categories?: SearchCategory[];
  /** Called when user submits search (Enter or button click) */
  onSearch?: (query: string, categoryValue?: string) => void;
  /** Optional additional class for the wrapper */
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search Amazon.in",
  categories = DEFAULT_CATEGORIES,
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches when suggestion panel opens
  const openSuggest = useCallback(() => {
    setRecentSearches(getRecent());
    setSuggestOpen(true);
    setHighlightedIdx(-1);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      fetchProducts({ search: debouncedQuery.trim(), limit: 5 })
        .then((res) => {
          setSuggestions(res || []);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (suggestRef.current && !suggestRef.current.contains(event.target as Node)
        && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      saveRecent(trimmed);
      setSuggestOpen(false);
      onSearch?.(trimmed, selectedCategory?.value || undefined);
    },
    [selectedCategory, onSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submitSearch(query);
    },
    [query, submitSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestOpen) return;
      
      const totalItems = recentSearches.length + (suggestions?.length || 0);
      if (totalItems === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx((i) => Math.min(i + 1, totalItems - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Escape") {
        setSuggestOpen(false);
        setHighlightedIdx(-1);
      } else if (e.key === "Enter" && highlightedIdx >= 0) {
        e.preventDefault();
        
        let chosen = "";
        if (highlightedIdx < suggestions.length) {
          chosen = suggestions[highlightedIdx].title;
        } else {
          chosen = recentSearches[highlightedIdx - suggestions.length];
        }
        
        if (chosen) {
          setQuery(chosen);
          submitSearch(chosen);
        }
      }
    },
    [suggestOpen, recentSearches, suggestions, highlightedIdx, submitSearch]
  );

  const handleRemoveRecent = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecent(q);
    setRecentSearches(getRecent());
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setRecentSearches([]);
    setSuggestOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-1 max-w-2xl min-w-0 relative", className)}
      role="search"
    >
      <div className="flex w-full rounded border border-amazon-nav-mid focus-within:ring-2 focus-within:ring-amazon-orange-dark bg-white">
        {/* Category dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => { setDropdownOpen((o) => !o); setSuggestOpen(false); }}
            className="flex items-center gap-0.5 px-3 py-2.5 bg-amazon-background border-r border-gray-300 text-amazon-text text-sm hover:bg-gray-200 min-w-[52px] transition-colors duration-200"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label="Search category"
          >
            <span className="max-w-[80px] truncate">
              {selectedCategory?.label ?? "All"}
            </span>
            <ChevronDownIcon
              className={cn("w-4 h-4 shrink-0 transition-transform", dropdownOpen && "rotate-180")}
            />
          </button>
          {dropdownOpen && (
            <ul
              className="absolute left-0 top-full mt-0.5 w-52 py-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-72 overflow-auto"
              role="listbox"
            >
              {categories.map((cat) => (
                <li
                  key={cat.value || "all"}
                  role="option"
                  aria-selected={selectedCategory?.value === cat.value}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-amazon-text hover:bg-amazon-orange cursor-pointer transition-colors duration-200"
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSuggestOpen(true);
          }}
          onFocus={openSuggest}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2 text-amazon-text text-sm outline-none"
          aria-label="Search"
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-12 bg-amazon-orange hover:bg-amber-300 text-amazon-nav-dark shrink-0 transition-colors"
          aria-label="Submit search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>

        {/* Recent searches & Suggestions dropdown */}
        {suggestOpen && (recentSearches.length > 0 || suggestions.length > 0) && (
          <div
            ref={suggestRef}
            className="absolute left-0 right-0 top-full mt-0.5 bg-white border border-gray-200 rounded shadow-lg z-50 text-amazon-text"
          >
            {suggestions.length > 0 && (
              <div className="border-b border-gray-100 pb-2">
                <div className="px-3 py-2 text-xs text-amazon-text-muted font-medium uppercase tracking-wide">
                  Suggestions
                </div>
                <ul>
                  {suggestions.map((p, idx) => (
                    <li
                      key={p.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer text-sm hover:focus-within transition-colors duration-150",
                        idx === highlightedIdx ? "bg-amazon-background" : "hover:bg-gray-50"
                      )}
                      onMouseDown={() => submitSearch(p.title)}
                    >
                      <div className="relative w-8 h-8 rounded shrink-0 bg-white">
                        <Image src={p.images?.[0]?.imageUrl || "https://dummyjson.com/image/100"} alt={p.title} fill className="object-contain" unoptimized />
                      </div>
                      <span className="flex-1 truncate font-medium">{p.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <span className="text-xs text-amazon-text-muted font-medium uppercase tracking-wide">
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-amazon-link-blue hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <ul>
                  {recentSearches.map((q, idx) => (
                    <li
                      key={q}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors duration-150",
                        idx + (suggestions.length || 0) === highlightedIdx ? "bg-amazon-background" : "hover:bg-gray-50"
                      )}
                      onMouseDown={() => {
                        setQuery(q);
                        submitSearch(q);
                      }}
                    >
                      <ClockIcon className="w-4 h-4 text-amazon-text-muted shrink-0" />
                      <span className="flex-1 truncate">{q}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecent(q, e)}
                        className="text-amazon-text-muted hover:text-amazon-text p-0.5"
                        aria-label={`Remove "${q}" from recent searches`}
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
