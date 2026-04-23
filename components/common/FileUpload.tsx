
import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';

interface FileUploadProps {
    onFileDrop: (files: File[]) => void;
    file: File | null;
    acceptedFileTypes?: { [key: string]: string[] };
    maxSize?: number; // in bytes
    isCircle?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileDrop, file, acceptedFileTypes, maxSize, isCircle = false }) => {
    const { t } = useLocalization();

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            // Handle rejections (e.g., show toast)
            console.error("File rejected:", fileRejections);
            alert(`File rejected: ${fileRejections[0].errors[0].message}`);
        }
        if (acceptedFiles.length > 0) {
            onFileDrop(acceptedFiles);
        }
    }, [onFileDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        maxSize,
        multiple: false,
    });
    
    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileDrop([]);
    };

    const containerClasses = `
        border-2 border-dashed
        ${isCircle ? 'rounded-full aspect-square w-40 h-40' : 'rounded-lg'}
        flex flex-col items-center justify-center text-center p-4 cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
    `;

    if (file) {
        const isImage = file.type.startsWith('image/');
        return (
            <div className={`relative ${isCircle ? 'w-40 h-40' : ''}`}>
                <div className={`p-2 border rounded-lg flex items-center gap-2 ${isCircle ? 'rounded-full w-full h-full' : ''}`}>
                    {isImage ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} className={`object-cover ${isCircle ? 'w-full h-full rounded-full' : 'w-16 h-16 rounded-md'}`} />
                    ) : (
                        <FileIcon className="w-10 h-10 text-gray-500" />
                    )}
                    {!isCircle && (
                        <div className="text-left overflow-hidden">
                            <p className="text-sm font-semibold truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    )}
                </div>
                <button onClick={removeFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={containerClasses}>
            <input {...getInputProps()} />
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-600">
                {isDragActive ? "Drop file here" : "Choose file or drag here"}
            </p>
            <p className="text-xs text-gray-500">
                {maxSize ? `Max size: ${maxSize / 1024 / 1024}MB` : ''}
            </p>
        </div>
    );
};

export default FileUpload;
