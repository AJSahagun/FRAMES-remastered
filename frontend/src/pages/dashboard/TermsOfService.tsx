import React, { useState, useEffect } from 'react';
import { MDXEditor } from '@mdxeditor/editor';
import { 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SettingsService } from '@/services/settings.service';

const TermsOfService: React.FC = () => {
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial TOS on component mount
  useEffect(() => {
    const fetchTOS = async () => {
      try {
        const response = await SettingsService.getTOS();
        setMarkdown(response.tos);
      } catch {
        toast.error('Failed to fetch Terms of Service');
      }
    };
    fetchTOS();
  }, []);

  const handleEnableEditor = () => {
    setEditorEnabled(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await SettingsService.updateTOS({ tos: markdown });
      toast.success('Terms of Service updated successfully');
      setEditorEnabled(false);
      setIsSaveModalOpen(false);
    } catch {
      toast.error('Failed to update Terms of Service');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewToggle = (checked: boolean) => {
    setIsPreview(checked);
  };

  const openSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">
          Terms of Service
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="preview-toggle">Preview Mode</Label>
            <Switch 
              id="preview-toggle"
              checked={isPreview}
              onCheckedChange={handlePreviewToggle}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow flex flex-col">
        {editorEnabled ? (
          <div className="flex-grow border-2 border-accent rounded-md overflow-hidden">
            <div className="bg-green-100 p-2 text-center">
              <p className="text-sm text-green-950">You are currently editing</p>
            </div>
            
            <MDXEditor 
              markdown={markdown} 
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <ListsToggle />
                    </>
                  )
                })
              ]}
              onChange={(newMarkdown) => setMarkdown(newMarkdown)} 
              readOnly={isPreview}
            />
          </div>
        ) : (
          <div className="flex-grow border rounded-md overflow-auto p-4 bg-slate-50">
            {isPreview ? (
              <MDXEditor 
                markdown={markdown} 
                plugins={[headingsPlugin()]}
                readOnly={true}
              />
            ) : (
              <pre className="whitespace-pre-wrap">{markdown}</pre>
            )}
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-4">
        <div className="space-x-2">
          {!editorEnabled ? (
            <Button onClick={handleEnableEditor}>
              Edit Terms of Service
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditorEnabled(false)}
              >
                Cancel
              </Button>
              <Button onClick={openSaveModal}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <Dialog 
        open={isSaveModalOpen} 
        onOpenChange={setIsSaveModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to the Terms of Service?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSaveChanges} 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Confirm Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TermsOfService;