"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import * as z from "zod";
import {
  MultiSlideSchema,
  SlideSchema,
  SlideType,
} from "@/lib/validation/slide-schema";
import { usePersistFormWithKey } from "@/lib/hooks/use-persist-form-with-key";
import { PdfDocument } from "@/components/pdf-document";
import {
  usePDF,
  // @ts-ignore: Library import from inner module to avoid thinking we are on node
} from "@react-pdf/renderer/lib/react-pdf.browser.es";
import { DocumentSchema } from "@/lib/validation/document-schema";
import { PagerProvider } from "@/lib/providers/pager-context";
import { usePager } from "@/lib/hooks/use-pager";
import EditorLayout from "./editor";

const defaultSlideValues: z.infer<typeof MultiSlideSchema> = [
  {
    type: SlideType.enum.Intro,
    title: "YOUR TITLE",
    subtitle: "Your awesome subtitle",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, dolorum.",
  },
  {
    type: SlideType.enum.Content,
    title: "A cool title for this slide",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, recusandae.",
  },
  {
    type: SlideType.enum.Content,
    title: "A cool title for this slide",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, recusandae.",
  },
  {
    type: SlideType.enum.Content,
    title: "A cool title for this slide",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, recusandae.",
  },
  {
    type: SlideType.enum.Outro,
    title: "YOUR TITLE",
    subtitle: "Your awesome subtitle",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, dolorum.",
  },
];

export default function Home() {
  const documentForm = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      slides: defaultSlideValues,
      config: {
        settings: {
          avatar: "https://www.franciscomoretti.com/profile_picture.jpg",
          name: "My name",
          handle: "@name",
        },
        theme: {
          isCustom: false,
          pallette: "pallette-1",
          primary: "#b1e4cc",
          secondary: "#9ac141",
          background: "#202624",
        },
        fonts: {
          font1: "DM_Serif_Display",
          font2: "DM_Sans",
        },
        pageNumber: {
          showNumbers: true,
        },
      },
    },
  });
  usePersistFormWithKey(documentForm, "documentFormKey");
  const documentValues = documentForm.watch();

  const pdfDocument = useMemo(
    () => <PdfDocument document={documentValues} />,
    [documentValues]
  );
  const [instance, updateInstance] = usePDF({ document: pdfDocument });
  const { loading: instanceLoading, url: instanceUrl } = instance;

  useEffect(() => {
    updateInstance(pdfDocument);
  }, [pdfDocument, updateInstance]);

  const pager = usePager(0); // num

  return (
    <FormProvider {...documentForm}>
      <PagerProvider value={pager}>
        <main className="flex min-h-screen flex-col w-full items-stretch justify-between">
          <EditorLayout instanceUrl={instanceUrl} />
        </main>
      </PagerProvider>
    </FormProvider>
  );
}
