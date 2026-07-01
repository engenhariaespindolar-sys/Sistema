import { Card, CardContent } from "@/components/ui/Card";
import { UploadDocumentoForm } from "@/components/documentos/UploadDocumentoForm";
import { DocumentoCard } from "@/components/documentos/DocumentoCard";
import { listDocumentos, getSignedUrl } from "@/lib/data/documentos";
import { uploadDocumento, deleteDocumento, resumirDocumentoAction } from "./actions";

export default async function DocumentosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const documentos = await listDocumentos(id);
  const signedUrls = await Promise.all(documentos.map((d) => getSignedUrl(d.url)));

  const uploadWithId = uploadDocumento.bind(null, id);
  const deleteWithId = deleteDocumento.bind(null, id);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-5">
          <UploadDocumentoForm action={uploadWithId} />
        </CardContent>
      </Card>

      {documentos.length === 0 ? (
        <p className="text-sm text-foreground-secondary">Nenhum documento enviado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map((doc, i) => (
            <DocumentoCard
              key={doc.id}
              documento={doc}
              signedUrl={signedUrls[i]}
              onResumir={resumirDocumentoAction}
              onExcluir={deleteWithId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
