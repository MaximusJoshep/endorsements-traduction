import React from 'react';
import ReactJson from 'react-json-view';
import './EndorseResult.css';

function EndorseResult({ data }) {
  return (
    <div className="endorse-result">
      <div className="json-viewer">
        <ReactJson
          src={data}
          theme="monokai"
          collapsed={2}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={true}
          style={{
            backgroundColor: '#272822',
            padding: '20px',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        />
      </div>
      <div className="result-actions">
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert('JSON copiado al portapapeles');
          }}
        >
          📋 Copiar JSON
        </button>
      </div>
    </div>
  );
}

export default EndorseResult;

