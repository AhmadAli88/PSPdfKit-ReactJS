/*eslint-disable*/
import { useEffect, useRef, useState } from 'react';

export default function ViewerComponent(props) {
  const containerRef = useRef(null);
  const [pspdfkitInstance, setPspdfkitInstance] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      try {
        PSPDFKit = await import('pspdfkit');

        PSPDFKit.unload(container);

        const instance = await PSPDFKit.load({
          container,
          document: props.document,
          baseUrl: `${window.location.protocol}//${window.location.host}/${
            import.meta.env.BASE_URL
          }`,
          editableAnnotations: true
        });

        setPspdfkitInstance(instance);
      } catch (error) {
        console.error('Error loading PSPDFKit:', error);
      }
    })();

    return () => {
      if (pspdfkitInstance) {
        PSPDFKit?.unload(container);
      }
    };
  }, [props.document]);

  const downloadUpdatedDocument = async () => {
    if (!pspdfkitInstance) {
      console.error('PSPDFKit instance not initialized.');
      return;
    }

    try {
      const annotations = await pspdfkitInstance.exportInstantJSON();
      const pdfData = await pspdfkitInstance.exportPDF({
        flatten: false,
        includeAnnotations: true,
        exportMeasurements: true
      });

      const blob = new Blob([pdfData], { type: 'application/pdf' });
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty.');
      }

      const fileName = props.fileName || 'updated_document.pdf';
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download the updated document. Please try again.');
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '80vh' }} />
      <button 
        onClick={downloadUpdatedDocument} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download Updated PDF
      </button>
    </div>
  );
}