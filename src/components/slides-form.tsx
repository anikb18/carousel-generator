"use client";
import { useFormContext } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/lib/document-form-types";
import { SlideType } from "@/lib/validation/slide-schema";
import { ContentSlideForm } from "./forms/content-slide-form";
import { OutroSlideForm } from "./forms/outro-slide-form";
import { IntroSlideForm } from "./forms/intro-slide-form";
import { usePagerContext } from "@/lib/providers/pager-context";

export function SlidesForm({
  slidesFieldArray,
}: {
  slidesFieldArray: SlidesFieldArrayReturn;
}) {
  const form: DocumentFormReturn = useFormContext(); // retrieve those props
  const { fields } = slidesFieldArray;
  const { currentPage } = usePagerContext();

  const currentFields = fields[currentPage];

  if (!currentFields) {
    return <p>Add a slide to start editing</p>;
  }

  return (
    <Form {...form}>
      <form>
        {currentFields.type == SlideType.enum.Content ? (
          <ContentSlideForm
            key={currentFields.id}
            currentSlide={currentPage}
            form={form}
          ></ContentSlideForm>
        ) : currentFields.type == SlideType.enum.Intro ? (
          <IntroSlideForm
            key={currentFields.id}
            currentSlide={currentPage}
            form={form}
          />
        ) : currentFields.type == SlideType.enum.Outro ? (
          <OutroSlideForm
            key={currentFields.id}
            currentSlide={currentPage}
            form={form}
          />
        ) : null}
      </form>
    </Form>
  );
}
