// /Users/anand/Desktop/cerebro/frontend/pages/workspace.tsx
import { useState } from 'react';

export default function Workspace() {
  const [activeDatasources] = useState([
    'SQL Server',
    'MongoDB',
    'Amazon S3',
    'Snowflake',
    'Google Drive',
    'Azure Data Lake',
    'Slack',
    'Microsoft Teams',
    'Jira'
  ]);

  const [showDatasourcesDropdown, setShowDatasourcesDropdown] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);

  const [taskStarted, setTaskStarted] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Task form fields
  const [taskDescription, setTaskDescription] = useState('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [selectedDatasources, setSelectedDatasources] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');

  const isTaskDescriptionValid = taskDescription.trim().length >= 16;
  const isInstructionsValid = instructions.trim().length === 0 || instructions.trim().length >= 16;
  const isFormValid = isTaskDescriptionValid && selectedDatasources.length > 0;

  const handleNewTask = () => {
    setShowTaskForm(true);
  }

  const handleDatasourceSelect = (ds: string) => {
    setSelectedDatasources(prev => {
      if (prev.includes(ds)) {
        return prev.filter(d => d !== ds);
      } else {
        return [...prev, ds];
      }
    });
  }

  const handleStartTask = () => {
    if (isFormValid) {
      setTaskStarted(true);
      setShowTaskForm(false);
    }
  }

  const handleStopOrComplete = () => {
    // For now, just reset everything (placeholder behavior)
    setTaskStarted(false);
    setTaskDescription('');
    setInstructions('');
    setAttachments(null);
    setSelectedDatasources([]);
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#eee', margin: 0 }}>
      {/* Top Bar */}
      <div style={{ width: '100%', height: '40px', background: '#ccc', display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Icons: We'll use simple text placeholders */}
        <div style={{ marginLeft: '10px', position: 'relative' }}
             onMouseEnter={() => setShowDatasourcesDropdown(true)}
             onMouseLeave={() => setShowDatasourcesDropdown(false)}>
          <span style={{ cursor: 'pointer' }}>📁({activeDatasources.length})</span>
          {showDatasourcesDropdown && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              background: '#fff',
              border: '1px solid #aaa',
              padding: '5px',
              zIndex: 10
            }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {activeDatasources.map(ds => (
                  <li key={ds} style={{ padding: '2px 0' }}>{ds}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Placeholder icons */}
        <div style={{ marginLeft: '20px' }}>🔧</div>
        <div style={{ marginLeft: '20px' }}>⚙️</div>

        {/* Stopped/Completed Tasks Icon */}
        <div style={{ marginLeft: '20px', position: 'relative' }}
             onMouseEnter={() => setShowTasksDropdown(true)}
             onMouseLeave={() => setShowTasksDropdown(false)}>
          <span style={{ cursor: 'pointer' }}>📜</span>
          {showTasksDropdown && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              background: '#fff',
              border: '1px solid #aaa',
              padding: '5px',
              zIndex: 10,
              width: '150px'
            }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ padding: '2px 0', cursor: 'pointer' }}>Completed Task 1 ✅</li>
                <li style={{ padding: '2px 0', cursor: 'pointer' }}>Stopped Task 2 ❌</li>
                <li style={{ padding: '2px 0', cursor: 'pointer' }}>Completed Task 3 ✅</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Area: split into 1/3 for chat and 2/3 for canvas */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Chat Box */}
        <div style={{ width: '33%', background: '#f9f9f9', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #ccc', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {taskStarted ? (
              <>
                <span style={{ fontWeight: 'bold' }}>Task Description Summary</span>
                <button onClick={handleStopOrComplete} style={{ padding: '4px 8px', fontSize: '12px' }}>Stop/Complete</button>
              </>
            ) : (
              <span style={{ fontWeight: 'bold' }}>Chat</span>
            )}
          </div>
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
            {!taskStarted && !showTaskForm && (
              <button onClick={handleNewTask} style={{ padding: '6px 12px' }}>New Task</button>
            )}
            {!taskStarted && showTaskForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>
                  Task Description (min 16 chars):<br/>
                  <textarea
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    style={{ width: '100%', height: '60px' }}
                  />
                </label>
                <label>
                  Attachments (optional):<br/>
                  <input type="file" multiple onChange={e => setAttachments(e.target.files)} />
                </label>
                <label>
                  Datasources (select multiple):<br/>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {activeDatasources.map(ds => (
                      <div key={ds} style={{ border: '1px solid #aaa', padding: '2px 4px', cursor: 'pointer', background: selectedDatasources.includes(ds) ? '#ddd' : '#fff' }}
                           onClick={() => handleDatasourceSelect(ds)}>
                        {ds}
                      </div>
                    ))}
                  </div>
                </label>
                <label>
                  Instructions (optional, if filled then min 16 chars):<br/>
                  <textarea
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    style={{ width: '100%', height: '60px' }}
                  />
                </label>
                <button onClick={handleStartTask} disabled={!isFormValid || !isInstructionsValid} style={{ padding: '6px 12px' }}>START</button>
              </div>
            )}
            {taskStarted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Chat messages would appear here in future */}
                <p>Chat is now active for this task. All messages are about this task.</p>
              </div>
            )}
          </div>
          {taskStarted && (
            <div style={{ borderTop: '1px solid #ccc', padding: '10px', display: 'flex', gap: '4px' }}>
              <input type="text" placeholder="Type your message..." style={{ flexGrow: 1, padding: '4px' }} />
              <button style={{ padding: '4px 8px' }}>Send</button>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div style={{ flexGrow: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Canvas - Work will be displayed here</span>
        </div>
      </div>
    </div>
  );
}