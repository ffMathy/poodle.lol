import { Component, OnRenderFn, component$ } from "@builder.io/qwik";
import { FieldPath, FieldValues, FormStore } from "@modular-forms/qwik";

export type ModularFormsComponentProps<TFieldValues extends FieldValues, TFieldPath extends FieldPath<TFieldValues>> = {
    fieldPath: TFieldPath;
    form: FormStore<TFieldValues, undefined>;
}