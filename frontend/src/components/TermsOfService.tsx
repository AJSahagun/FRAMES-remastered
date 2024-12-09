import { useEffect, useRef, useState } from "react";
import { fallbackTerms } from "../data/terms-fallback";
import { SettingsService } from "@/services/settings.service";
import { MDXEditor } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { toast } from "react-toastify";

interface TermsOfServiceProps {
  isOpen: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

const TermsOfService = ({
  isOpen,
  onAgree,
  onDisagree,
}: TermsOfServiceProps) => {
  const [terms, setTerms] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTermsScrolledToBottom, setIsTermsScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const termsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsData = await SettingsService.getTOS();
        setTerms(termsData.tos);
      } catch (error) {
        console.warn("Failed to fetch terms from API:", error);
        toast.warning("Using offline terms of service");
        setTerms(fallbackTerms.tos);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTerms();
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (termsContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsContentRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

      if (isAtBottom && !isTermsScrolledToBottom) {
        setIsTermsScrolledToBottom(true);
        setShowScrollHint(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 max-h-[90vh] font-poppins">
        <h2 className="flex justify-center text-xl font-bold text-tc mb-4">
          Terms of Service - FRAMES
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tc"></div>
          </div>
        ) : terms ? (
          <>
            <div
              ref={termsContentRef}
              onScroll={handleScroll}
              className="relative overflow-auto max-h-[25vh] sm:max-h-[40vh] mt-4 px-4 py-2 border-2 border-tc rounded-lg"
            >
              <MDXEditor
                className="h-full overflow-auto"
                contentEditableClassName="prose"
                markdown={terms}
                plugins={[headingsPlugin(), listsPlugin(), quotePlugin()]}
                readOnly={true}
              />

              {showScrollHint && !isTermsScrolledToBottom && (
                <div className="sticky bottom-0 w-full bg-gray-700 opacity-70 border-black border rounded-md p-4 text-center">
                  <span className="text-tc text-white text-sm animate-bounce inline-block">
                    Please scroll to the bottom to enable the agreement button
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 mr-2 mb-2 flex flex-col sm:flex-row sm:space-x-4 justify-end sm:items-center">
              <button
                onClick={onAgree}
                disabled={!isTermsScrolledToBottom}
                className={`px-4 py-2 w-full sm:w-4/12 rounded-md shadow-md text-white 
                  ${
                    isTermsScrolledToBottom
                      ? "bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
                      : "bg-gray-400 cursor-not-allowed"
                  } mb-2 sm:mb-0`}
              >
                I Agree
              </button>

              <button
                onClick={onDisagree}
                className="px-4 py-2 w-full sm:w-4/12 rounded-md shadow-md text-black border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc transition-colors duration-300"
              >
                I Disagree
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>Unable to load Terms of Service. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfService;
