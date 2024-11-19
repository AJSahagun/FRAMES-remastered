import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { termsService } from '../services/terms.service';
import { fallbackTerms } from '../data/terms-fallback';
import { TermsOfService as TermsType } from '../types/terms.types';

interface TermsOfServiceProps {
  isOpen: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

const TermsOfService = ({ isOpen, onAgree, onDisagree }: TermsOfServiceProps) => {
  const [terms, setTerms] = useState<TermsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTermsScrolledToBottom, setIsTermsScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const termsContentRef = useRef<HTMLDivElement>(null);

  const termsStyles = `
    .terms-content {
        color: #333;
        line-height: 1.6;
    }

    .terms-section {
        margin-bottom: 1.5rem;
    }

    .terms-section h3 {
        color: #1a1a1a;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        margin-top: 1.5rem;
    }

    .terms-intro {
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }

    .terms-warning {
        color: #666;
        font-style: italic;
        margin-bottom: 1.5rem;
    }

    .terms-content ul {
        list-style-type: disc;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }

    .terms-content ul ul {
        list-style-type: circle;
        margin-left: 1.5rem;
        margin-top: 0.5rem;
    }

    .terms-content li {
        margin-bottom: 0.5rem;
    }

    .contact-info {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
    }

    .contact-info p {
        margin: 0.25rem 0;
    }
    `;

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsData = await termsService.getTermsOfService();
        setTerms(termsData);
      } catch (error) {
        console.error('Failed to fetch terms from API:', error);
        toast.error('Using offline terms of service');
        setTerms(fallbackTerms);
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

  const renderTermsContent = (content: string, format: 'html' | 'markdown') => {
    if (format === 'html') {
      return (
        <>
          <style>{termsStyles}</style>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </>
      );
    }
    // Add markdown support if needed
    return <div>{content}</div>;
  };

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
              {renderTermsContent(terms.content, terms.format)}
              
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
                  ${isTermsScrolledToBottom 
                    ? 'bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
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