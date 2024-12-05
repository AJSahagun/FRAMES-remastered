import { MDXEditor } from '@mdxeditor/editor'
import { headingsPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useState } from 'react';

const TermsOfService: React.FC = () => {
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [markdown, setMarkdown] = useState('HelloWorld');

  const isEditorEnabled = () => {
    setEditorEnabled(true);
    console.log('function isEditorEnabled called');
  }

  const handleSaveChanges = async () => {
    setEditorEnabled(false);
    // TODO: Save changes to the database
    console.log('Saved content: ',markdown);
  }


	return(
		<div className="max-h-dvh p-6 space-y-5">
		  {/* Header */}
			<div className="flex justify-between items-center">
				<div className="flex">
					<h1 className="font-poppins text-primary text-4xl xl:text-5xl font-semibold">
						Terms of Service
					</h1>
				</div>
			</div>

      <div className="flex justify-center flex-col px-48 space-y-3">
        <div className="flex items-center justify-end">
          <button className="flex items-center py-1 px-2 border-2 border-accent rounded-sm text-md bg-sf text-accent font-poppins hover:brightness-75 hover:ring-1 active:opacity-70"
          onClick={isEditorEnabled}
          >
            <img 
            src="/write-icon.svg" 
            alt="" 
            className="w-5 mr-1"
            />
            Edit
          </button>
        </div>

        {/* Markdown Editor */}
          {editorEnabled ? (
            <div className="border-2 border-green-900">  
            <div>
              <div className="flex justify-center bg-green-100">
                <p className="text-sm text-green-950">
                  You are currently editing.
                </p>
              </div>

              <div>
                <MDXEditor 
                markdown={markdown} 
                plugins={[headingsPlugin()]}
                onChange={(newMarkdown) => setMarkdown(newMarkdown)} />
              </div>

              <div className="flex justify-end mb-4">
                <button className="p-1 px-4 bg-accent rounded-md drop-shadow-sm font-poppins text-white mr-4 hover:ring-2 hover:ring-secondary active:opacity-70"
                onClick={handleSaveChanges}
                >
                  Save
                </button>
              </div>

            </div>
          </div>

          ) : (

            <div className="flex flex-col justify-center opacity-70">
              <div className="flex justify-center bg-slate-200">
                <p className="text-sm text-slate-600">
                  Editor is disabled.
                </p>
              </div>

              <div className="flex justify-center">
                <div>
                  {markdown}
                </div>
              </div>
            </div>
            
          )
          
        }

        </div>
      
		</div>
	)
};

export default TermsOfService;