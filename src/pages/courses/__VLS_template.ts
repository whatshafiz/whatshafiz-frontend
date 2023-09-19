import { FormLabel, FormInput } from "@/base-components/Form";
import Button from "@/base-components/Button";
import Lucide from "@/base-components/Lucide";
import LoadingIcon from '@/base-components/LoadingIcon';
import TomSelect from '@/base-components/TomSelect';
import FormSwitch from '@/base-components/Form/FormSwitch';
import { __VLS_publicComponent, __VLS_internalComponent, __VLS_componentsOption, __VLS_name, user, onSubmit, course, isLoading, router } from "./Create.vue";

function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_publicComponent, new () => {}>> & InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & typeof __VLS_publicComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {} &
__VLS_WithComponent<'FormLabel', typeof __VLS_localComponents, "FormLabel", "FormLabel", "FormLabel"> &
__VLS_WithComponent<'TomSelect', typeof __VLS_localComponents, "TomSelect", "TomSelect", "TomSelect"> &
__VLS_WithComponent<'FormInput', typeof __VLS_localComponents, "FormInput", "FormInput", "FormInput"> &
__VLS_WithComponent<'Lucide', typeof __VLS_localComponents, "Lucide", "Lucide", "Lucide"> &
__VLS_WithComponent<'FormSwitch', typeof __VLS_localComponents, "FormSwitch", "FormSwitch", "FormSwitch"> &
__VLS_WithComponent<'Button', typeof __VLS_localComponents, "Button", "Button", "Button"> &
__VLS_WithComponent<'LoadingIcon', typeof __VLS_localComponents, "LoadingIcon", "LoadingIcon", "LoadingIcon">;
({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).h2; ({} as __VLS_IntrinsicElements).h2; ({} as __VLS_IntrinsicElements).h2; ({} as __VLS_IntrinsicElements).h2;
({} as __VLS_IntrinsicElements).form; ({} as __VLS_IntrinsicElements).form;
__VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel; __VLS_components.FormLabel;
// @ts-ignore
[FormLabel, FormLabel, FormLabel, FormLabel, FormLabel, FormLabel, FormLabel, FormLabel, FormLabel, FormLabel,];
({} as __VLS_IntrinsicElements).span; ({} as __VLS_IntrinsicElements).span; ({} as __VLS_IntrinsicElements).span; ({} as __VLS_IntrinsicElements).span;
__VLS_components.TomSelect; __VLS_components.TomSelect;
// @ts-ignore
[TomSelect, TomSelect,];
({} as __VLS_IntrinsicElements).option; ({} as __VLS_IntrinsicElements).option; ({} as __VLS_IntrinsicElements).option; ({} as __VLS_IntrinsicElements).option; ({} as __VLS_IntrinsicElements).option; ({} as __VLS_IntrinsicElements).option;
__VLS_components.FormInput; __VLS_components.FormInput; __VLS_components.FormInput; __VLS_components.FormInput;
// @ts-ignore
[FormInput, FormInput, FormInput, FormInput,];
__VLS_components.Lucide; __VLS_components.Lucide; __VLS_components.Lucide;
// @ts-ignore
[Lucide, Lucide, Lucide,];
({} as __VLS_IntrinsicElements).label; ({} as __VLS_IntrinsicElements).label; ({} as __VLS_IntrinsicElements).label; ({} as __VLS_IntrinsicElements).label;
__VLS_components.FormSwitch; __VLS_components.FormSwitch; __VLS_components.FormSwitch; __VLS_components.FormSwitch;
// @ts-ignore
[FormSwitch, FormSwitch, FormSwitch, FormSwitch,];
__VLS_components["FormSwitch.Input"]; __VLS_components["FormSwitch.Input"];
__VLS_components["FormSwitch.Label"]; __VLS_components["FormSwitch.Label"]; __VLS_components["FormSwitch.Label"]; __VLS_components["FormSwitch.Label"];
__VLS_components.Button; __VLS_components.Button; __VLS_components.Button; __VLS_components.Button;
// @ts-ignore
[Button, Button, Button, Button,];
__VLS_components.LoadingIcon;
// @ts-ignore
[LoadingIcon,];
if (__VLS_ctx.user.can('courses.create')) {
{
const __VLS_0 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_2 = __VLS_1({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
{
const __VLS_4 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_6 = __VLS_5({ ...{ ...{}, class: ("flex items-center mt-8 intro-y"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_7 = __VLS_pickFunctionalComponentCtx(__VLS_4, __VLS_6)!;
{
const __VLS_8 = ({} as __VLS_IntrinsicElements)["h2"];
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, {});
({} as __VLS_IntrinsicElements).h2;
({} as __VLS_IntrinsicElements).h2;
const __VLS_10 = __VLS_9({ ...{ ...{}, class: ("mr-auto text-lg font-medium"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10)!;
(__VLS_11.slots!).default;
}
(__VLS_7.slots!).default;
}
{
const __VLS_12 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_14 = __VLS_13({ ...{ ...{}, class: ("grid grid-cols-12 gap-6 mt-5"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_15 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14)!;
{
const __VLS_16 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_18 = __VLS_17({ ...{ ...{}, class: ("col-span-12 intro-y lg:col-span-6"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18)!;
{
const __VLS_20 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_22 = __VLS_21({ ...{ ...{}, class: ("intro-y box"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22)!;
{
const __VLS_24 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_26 = __VLS_25({ ...{ ...{}, class: ("flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26)!;
{
const __VLS_28 = ({} as __VLS_IntrinsicElements)["h2"];
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, {});
({} as __VLS_IntrinsicElements).h2;
({} as __VLS_IntrinsicElements).h2;
const __VLS_30 = __VLS_29({ ...{ ...{}, class: ("mr-auto text-base font-medium"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_28, __VLS_30)!;
(__VLS_31.slots!).default;
}
(__VLS_27.slots!).default;
}
{
const __VLS_32 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_34 = __VLS_33({ ...{ ...{}, class: ("p-5"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34)!;
{
const __VLS_36 = ({} as __VLS_IntrinsicElements)["form"];
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, {});
({} as __VLS_IntrinsicElements).form;
({} as __VLS_IntrinsicElements).form;
const __VLS_38 = __VLS_37({ ...{ ...{ onSubmit: {} as any, }, class: ("validate-form"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38)!;
let __VLS_40 = { 'submit': __VLS_pickEvent(__VLS_39.emit!, 'submit' as const, __VLS_componentProps(__VLS_37, __VLS_38).onSubmit) };
__VLS_40 = {
submit: (__VLS_ctx.onSubmit)
};
{
const __VLS_41 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_43 = __VLS_42({ ...{ ...{}, class: ("input-form"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_42));
const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43)!;
{
let __VLS_45!: 'FormLabel' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormLabel : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormLabel'];
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }));
({} as { FormLabel: typeof __VLS_45; }).FormLabel;
({} as { FormLabel: typeof __VLS_45; }).FormLabel;
const __VLS_47 = __VLS_46({ ...{ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_46));
const __VLS_48 = __VLS_pickFunctionalComponentCtx(__VLS_45, __VLS_47)!;
{
const __VLS_49 = ({} as __VLS_IntrinsicElements)["span"];
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, {});
({} as __VLS_IntrinsicElements).span;
({} as __VLS_IntrinsicElements).span;
const __VLS_51 = __VLS_50({ ...{ ...{}, class: ("mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_50));
const __VLS_52 = __VLS_pickFunctionalComponentCtx(__VLS_49, __VLS_51)!;
(__VLS_52.slots!).default;
}
(__VLS_48.slots!).default;
}
{
let __VLS_53!: 'TomSelect' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.TomSelect : (typeof __VLS_resolvedLocalAndGlobalComponents)['TomSelect'];
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({ ...{}, modelValue: ((__VLS_ctx.course.type)), options: (({ placeholder: 'Kurs türü seçin.' })), class: ("w-full"), }));
({} as { TomSelect: typeof __VLS_53; }).TomSelect;
({} as { TomSelect: typeof __VLS_53; }).TomSelect;
const __VLS_55 = __VLS_54({ ...{ ...{}, modelValue: ((__VLS_ctx.course.type)), options: (({ placeholder: 'Kurs türü seçin.' })), class: ("w-full"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_54));
const __VLS_56 = __VLS_pickFunctionalComponentCtx(__VLS_53, __VLS_55)!;
{
const __VLS_57 = ({} as __VLS_IntrinsicElements)["option"];
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, {});
({} as __VLS_IntrinsicElements).option;
({} as __VLS_IntrinsicElements).option;
const __VLS_59 = __VLS_58({ ...{ ...{}, key: ("whatshafiz"), value: ("whatshafiz"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_58));
const __VLS_60 = __VLS_pickFunctionalComponentCtx(__VLS_57, __VLS_59)!;
(__VLS_60.slots!).default;
}
{
const __VLS_61 = ({} as __VLS_IntrinsicElements)["option"];
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, {});
({} as __VLS_IntrinsicElements).option;
({} as __VLS_IntrinsicElements).option;
const __VLS_63 = __VLS_62({ ...{ ...{}, key: ("whatsenglish"), value: ("whatsenglish"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_62));
const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63)!;
(__VLS_64.slots!).default;
}
{
const __VLS_65 = ({} as __VLS_IntrinsicElements)["option"];
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, {});
({} as __VLS_IntrinsicElements).option;
({} as __VLS_IntrinsicElements).option;
const __VLS_67 = __VLS_66({ ...{ ...{}, key: ("whatsarapp"), value: ("whatsarapp"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_66));
const __VLS_68 = __VLS_pickFunctionalComponentCtx(__VLS_65, __VLS_67)!;
(__VLS_68.slots!).default;
}
(__VLS_56.slots!).default;
}
(__VLS_44.slots!).default;
}
{
const __VLS_69 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_71 = __VLS_70({ ...{ ...{}, class: ("input-form mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_70));
const __VLS_72 = __VLS_pickFunctionalComponentCtx(__VLS_69, __VLS_71)!;
{
let __VLS_73!: 'FormLabel' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormLabel : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormLabel'];
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }));
({} as { FormLabel: typeof __VLS_73; }).FormLabel;
({} as { FormLabel: typeof __VLS_73; }).FormLabel;
const __VLS_75 = __VLS_74({ ...{ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_74));
const __VLS_76 = __VLS_pickFunctionalComponentCtx(__VLS_73, __VLS_75)!;
{
const __VLS_77 = ({} as __VLS_IntrinsicElements)["span"];
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, {});
({} as __VLS_IntrinsicElements).span;
({} as __VLS_IntrinsicElements).span;
const __VLS_79 = __VLS_78({ ...{ ...{}, class: ("mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_78));
const __VLS_80 = __VLS_pickFunctionalComponentCtx(__VLS_77, __VLS_79)!;
(__VLS_80.slots!).default;
}
(__VLS_76.slots!).default;
}
{
let __VLS_81!: 'FormInput' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormInput : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormInput'];
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({ ...{}, id: ("name"), modelValue: ((__VLS_ctx.course.name)), value: ((__VLS_ctx.course.name)), type: ("text"), name: ("name"), required: (true), placeholder: ("Kurs Adını Yazın"), }));
({} as { FormInput: typeof __VLS_81; }).FormInput;
const __VLS_83 = __VLS_82({ ...{ ...{}, id: ("name"), modelValue: ((__VLS_ctx.course.name)), value: ((__VLS_ctx.course.name)), type: ("text"), name: ("name"), required: (true), placeholder: ("Kurs Adını Yazın"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_82));
const __VLS_84 = __VLS_pickFunctionalComponentCtx(__VLS_81, __VLS_83)!;
}
(__VLS_72.slots!).default;
}
{
const __VLS_85 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_87 = __VLS_86({ ...{ ...{}, class: ("input-form mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_86));
const __VLS_88 = __VLS_pickFunctionalComponentCtx(__VLS_85, __VLS_87)!;
{
let __VLS_89!: 'FormLabel' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormLabel : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormLabel'];
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }));
({} as { FormLabel: typeof __VLS_89; }).FormLabel;
({} as { FormLabel: typeof __VLS_89; }).FormLabel;
const __VLS_91 = __VLS_90({ ...{ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_90));
const __VLS_92 = __VLS_pickFunctionalComponentCtx(__VLS_89, __VLS_91)!;
(__VLS_92.slots!).default;
}
{
const __VLS_93 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_95 = __VLS_94({ ...{ ...{}, class: ("relative w-90"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_96 = __VLS_pickFunctionalComponentCtx(__VLS_93, __VLS_95)!;
{
const __VLS_97 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_99 = __VLS_98({ ...{ ...{}, class: ("absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_98));
const __VLS_100 = __VLS_pickFunctionalComponentCtx(__VLS_97, __VLS_99)!;
{
let __VLS_101!: 'Lucide' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Lucide : (typeof __VLS_resolvedLocalAndGlobalComponents)['Lucide'];
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }));
({} as { Lucide: typeof __VLS_101; }).Lucide;
const __VLS_103 = __VLS_102({ ...{ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_102));
const __VLS_104 = __VLS_pickFunctionalComponentCtx(__VLS_101, __VLS_103)!;
}
(__VLS_100.slots!).default;
}
{
let __VLS_105!: 'FormInput' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormInput : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormInput'];
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({ ...{}, id: ("can_be_applied_until"), modelValue: ((__VLS_ctx.course.can_be_applied_until)), value: ((__VLS_ctx.course.can_be_applied_until)), type: ("datetime-local"), name: ("can_be_applied_until"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }));
({} as { FormInput: typeof __VLS_105; }).FormInput;
const __VLS_107 = __VLS_106({ ...{ ...{}, id: ("can_be_applied_until"), modelValue: ((__VLS_ctx.course.can_be_applied_until)), value: ((__VLS_ctx.course.can_be_applied_until)), type: ("datetime-local"), name: ("can_be_applied_until"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_106));
const __VLS_108 = __VLS_pickFunctionalComponentCtx(__VLS_105, __VLS_107)!;
}
(__VLS_96.slots!).default;
}
(__VLS_88.slots!).default;
}
if (__VLS_ctx.course.type === 'whatshafiz') {
{
const __VLS_109 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_111 = __VLS_110({ ...{ ...{}, class: ("input-form mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_110));
const __VLS_112 = __VLS_pickFunctionalComponentCtx(__VLS_109, __VLS_111)!;
{
let __VLS_113!: 'FormLabel' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormLabel : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormLabel'];
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }));
({} as { FormLabel: typeof __VLS_113; }).FormLabel;
({} as { FormLabel: typeof __VLS_113; }).FormLabel;
const __VLS_115 = __VLS_114({ ...{ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_114));
const __VLS_116 = __VLS_pickFunctionalComponentCtx(__VLS_113, __VLS_115)!;
(__VLS_116.slots!).default;
}
{
const __VLS_117 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_119 = __VLS_118({ ...{ ...{}, class: ("relative w-90"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_118));
const __VLS_120 = __VLS_pickFunctionalComponentCtx(__VLS_117, __VLS_119)!;
{
const __VLS_121 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_123 = __VLS_122({ ...{ ...{}, class: ("absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_122));
const __VLS_124 = __VLS_pickFunctionalComponentCtx(__VLS_121, __VLS_123)!;
{
let __VLS_125!: 'Lucide' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Lucide : (typeof __VLS_resolvedLocalAndGlobalComponents)['Lucide'];
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }));
({} as { Lucide: typeof __VLS_125; }).Lucide;
const __VLS_127 = __VLS_126({ ...{ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_126));
const __VLS_128 = __VLS_pickFunctionalComponentCtx(__VLS_125, __VLS_127)!;
}
(__VLS_124.slots!).default;
}
{
let __VLS_129!: 'FormInput' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormInput : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormInput'];
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({ ...{}, id: ("proficiency_exam_start_time"), modelValue: ((__VLS_ctx.course.proficiency_exam_start_time)), value: ((__VLS_ctx.course.proficiency_exam_start_time)), type: ("datetime-local"), name: ("proficiency_exam_start_time"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }));
({} as { FormInput: typeof __VLS_129; }).FormInput;
const __VLS_131 = __VLS_130({ ...{ ...{}, id: ("proficiency_exam_start_time"), modelValue: ((__VLS_ctx.course.proficiency_exam_start_time)), value: ((__VLS_ctx.course.proficiency_exam_start_time)), type: ("datetime-local"), name: ("proficiency_exam_start_time"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_130));
const __VLS_132 = __VLS_pickFunctionalComponentCtx(__VLS_129, __VLS_131)!;
}
(__VLS_120.slots!).default;
}
(__VLS_112.slots!).default;
}
// @ts-ignore
[user, onSubmit, course, course, course, course, course, course, course, course, course, course, course, course, course, course, course,];
}
{
const __VLS_133 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_135 = __VLS_134({ ...{ ...{}, class: ("input-form mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_134));
const __VLS_136 = __VLS_pickFunctionalComponentCtx(__VLS_133, __VLS_135)!;
{
let __VLS_137!: 'FormLabel' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormLabel : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormLabel'];
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }));
({} as { FormLabel: typeof __VLS_137; }).FormLabel;
({} as { FormLabel: typeof __VLS_137; }).FormLabel;
const __VLS_139 = __VLS_138({ ...{ ...{}, htmlFor: ("name"), class: ("flex flex-col w-full sm:flex-row"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_138));
const __VLS_140 = __VLS_pickFunctionalComponentCtx(__VLS_137, __VLS_139)!;
(__VLS_140.slots!).default;
}
{
const __VLS_141 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_143 = __VLS_142({ ...{ ...{}, class: ("relative w-90"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_142));
const __VLS_144 = __VLS_pickFunctionalComponentCtx(__VLS_141, __VLS_143)!;
{
const __VLS_145 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_147 = __VLS_146({ ...{ ...{}, class: ("absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_146));
const __VLS_148 = __VLS_pickFunctionalComponentCtx(__VLS_145, __VLS_147)!;
{
let __VLS_149!: 'Lucide' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Lucide : (typeof __VLS_resolvedLocalAndGlobalComponents)['Lucide'];
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }));
({} as { Lucide: typeof __VLS_149; }).Lucide;
const __VLS_151 = __VLS_150({ ...{ ...{}, icon: ("Calendar"), class: ("w-4 h-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_150));
const __VLS_152 = __VLS_pickFunctionalComponentCtx(__VLS_149, __VLS_151)!;
}
(__VLS_148.slots!).default;
}
{
let __VLS_153!: 'FormInput' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormInput : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormInput'];
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({ ...{}, id: ("start_at"), modelValue: ((__VLS_ctx.course.start_at)), value: ((__VLS_ctx.course.start_at)), type: ("datetime-local"), name: ("start_at"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }));
({} as { FormInput: typeof __VLS_153; }).FormInput;
const __VLS_155 = __VLS_154({ ...{ ...{}, id: ("start_at"), modelValue: ((__VLS_ctx.course.start_at)), value: ((__VLS_ctx.course.start_at)), type: ("datetime-local"), name: ("start_at"), required: (true), class: ("pl-12"), min: ("2023-01-01T00:00"), max: ("2040-01-01T00:00"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_154));
const __VLS_156 = __VLS_pickFunctionalComponentCtx(__VLS_153, __VLS_155)!;
}
(__VLS_144.slots!).default;
}
(__VLS_136.slots!).default;
}
{
const __VLS_157 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_159 = __VLS_158({ ...{ ...{}, class: ("mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_158));
const __VLS_160 = __VLS_pickFunctionalComponentCtx(__VLS_157, __VLS_159)!;
{
const __VLS_161 = ({} as __VLS_IntrinsicElements)["label"];
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, {});
({} as __VLS_IntrinsicElements).label;
({} as __VLS_IntrinsicElements).label;
const __VLS_163 = __VLS_162({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_162));
const __VLS_164 = __VLS_pickFunctionalComponentCtx(__VLS_161, __VLS_163)!;
(__VLS_164.slots!).default;
}
{
const __VLS_165 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_167 = __VLS_166({ ...{ ...{}, class: ("mt-2"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_166));
const __VLS_168 = __VLS_pickFunctionalComponentCtx(__VLS_165, __VLS_167)!;
{
let __VLS_169!: 'FormSwitch' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormSwitch : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormSwitch'];
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({ ...{}, }));
({} as { FormSwitch: typeof __VLS_169; }).FormSwitch;
({} as { FormSwitch: typeof __VLS_169; }).FormSwitch;
const __VLS_171 = __VLS_170({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_170));
const __VLS_172 = __VLS_pickFunctionalComponentCtx(__VLS_169, __VLS_171)!;
{
const __VLS_173 = __VLS_ctx.FormSwitch.Input;
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({ ...{}, id: ("is_active"), type: ("checkbox"), name: ("is_active"), modelValue: ((__VLS_ctx.course.is_active)), }));
const __VLS_175 = __VLS_174({ ...{ ...{}, id: ("is_active"), type: ("checkbox"), name: ("is_active"), modelValue: ((__VLS_ctx.course.is_active)), }, }, ...__VLS_functionalComponentArgsRest(__VLS_174));
const __VLS_176 = __VLS_pickFunctionalComponentCtx(__VLS_173, __VLS_175)!;
}
{
const __VLS_177 = __VLS_ctx.FormSwitch.Label;
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({ ...{}, htmlFor: ("is_active"), }));
const __VLS_179 = __VLS_178({ ...{ ...{}, htmlFor: ("is_active"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_178));
const __VLS_180 = __VLS_pickFunctionalComponentCtx(__VLS_177, __VLS_179)!;
(__VLS_180.slots!).default;
}
(__VLS_172.slots!).default;
}
(__VLS_168.slots!).default;
}
(__VLS_160.slots!).default;
}
{
const __VLS_181 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_183 = __VLS_182({ ...{ ...{}, class: ("mt-4"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_182));
const __VLS_184 = __VLS_pickFunctionalComponentCtx(__VLS_181, __VLS_183)!;
{
const __VLS_185 = ({} as __VLS_IntrinsicElements)["label"];
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, {});
({} as __VLS_IntrinsicElements).label;
({} as __VLS_IntrinsicElements).label;
const __VLS_187 = __VLS_186({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_186));
const __VLS_188 = __VLS_pickFunctionalComponentCtx(__VLS_185, __VLS_187)!;
(__VLS_188.slots!).default;
}
{
const __VLS_189 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_191 = __VLS_190({ ...{ ...{}, class: ("mt-2"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_190));
const __VLS_192 = __VLS_pickFunctionalComponentCtx(__VLS_189, __VLS_191)!;
{
let __VLS_193!: 'FormSwitch' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.FormSwitch : (typeof __VLS_resolvedLocalAndGlobalComponents)['FormSwitch'];
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({ ...{}, }));
({} as { FormSwitch: typeof __VLS_193; }).FormSwitch;
({} as { FormSwitch: typeof __VLS_193; }).FormSwitch;
const __VLS_195 = __VLS_194({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_194));
const __VLS_196 = __VLS_pickFunctionalComponentCtx(__VLS_193, __VLS_195)!;
{
const __VLS_197 = __VLS_ctx.FormSwitch.Input;
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({ ...{}, id: ("can_be_applied"), type: ("checkbox"), name: ("can_be_applied"), modelValue: ((__VLS_ctx.course.can_be_applied)), }));
const __VLS_199 = __VLS_198({ ...{ ...{}, id: ("can_be_applied"), type: ("checkbox"), name: ("can_be_applied"), modelValue: ((__VLS_ctx.course.can_be_applied)), }, }, ...__VLS_functionalComponentArgsRest(__VLS_198));
const __VLS_200 = __VLS_pickFunctionalComponentCtx(__VLS_197, __VLS_199)!;
}
{
const __VLS_201 = __VLS_ctx.FormSwitch.Label;
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({ ...{}, htmlFor: ("can_be_applied"), }));
const __VLS_203 = __VLS_202({ ...{ ...{}, htmlFor: ("can_be_applied"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_202));
const __VLS_204 = __VLS_pickFunctionalComponentCtx(__VLS_201, __VLS_203)!;
(__VLS_204.slots!).default;
}
(__VLS_196.slots!).default;
}
(__VLS_192.slots!).default;
}
(__VLS_184.slots!).default;
}
{
let __VLS_205!: 'Button' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Button : (typeof __VLS_resolvedLocalAndGlobalComponents)['Button'];
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({ ...{}, variant: ("primary"), type: ("submit"), class: ("w-1/2 mt-5 mr-2"), disabled: ((__VLS_ctx.isLoading)), }));
({} as { Button: typeof __VLS_205; }).Button;
({} as { Button: typeof __VLS_205; }).Button;
const __VLS_207 = __VLS_206({ ...{ ...{}, variant: ("primary"), type: ("submit"), class: ("w-1/2 mt-5 mr-2"), disabled: ((__VLS_ctx.isLoading)), }, }, ...__VLS_functionalComponentArgsRest(__VLS_206));
const __VLS_208 = __VLS_pickFunctionalComponentCtx(__VLS_205, __VLS_207)!;
{
let __VLS_209!: 'LoadingIcon' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.LoadingIcon : (typeof __VLS_resolvedLocalAndGlobalComponents)['LoadingIcon'];
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({ ...{}, icon: ("oval"), color: ("white"), class: ("w-4 h-4 mr-5"), }));
({} as { LoadingIcon: typeof __VLS_209; }).LoadingIcon;
const __VLS_211 = __VLS_210({ ...{ ...{}, icon: ("oval"), color: ("white"), class: ("w-4 h-4 mr-5"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_210));
const __VLS_212 = __VLS_pickFunctionalComponentCtx(__VLS_209, __VLS_211)!;
__VLS_directiveFunction(__VLS_ctx.vShow)((__VLS_ctx.isLoading));
}
(__VLS_208.slots!).default;
}
{
let __VLS_213!: 'Button' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Button : (typeof __VLS_resolvedLocalAndGlobalComponents)['Button'];
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({ ...{ onClick: {} as any, }, variant: ("outline-secondary"), type: ("button"), class: ("mt-5 mr-5"), }));
({} as { Button: typeof __VLS_213; }).Button;
({} as { Button: typeof __VLS_213; }).Button;
const __VLS_215 = __VLS_214({ ...{ ...{ onClick: {} as any, }, variant: ("outline-secondary"), type: ("button"), class: ("mt-5 mr-5"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_214));
const __VLS_216 = __VLS_pickFunctionalComponentCtx(__VLS_213, __VLS_215)!;
let __VLS_217 = { 'click': __VLS_pickEvent(__VLS_216.emit!, 'click' as const, __VLS_componentProps(__VLS_214, __VLS_215).onClick) };
__VLS_217 = {
click: (() => __VLS_ctx.router.go(-1))
};
(__VLS_216.slots!).default;
}
(__VLS_39.slots!).default;
}
(__VLS_35.slots!).default;
}
(__VLS_23.slots!).default;
}
(__VLS_19.slots!).default;
}
(__VLS_15.slots!).default;
}
(__VLS_3.slots!).default;
}
// @ts-ignore
[course, course, course, course, FormSwitch, course, course, FormSwitch, FormSwitch, course, course, FormSwitch, isLoading, isLoading, isLoading, router,];
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
return __VLS_slots;
}
