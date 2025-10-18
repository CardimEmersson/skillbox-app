import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, Checkbox, CustomButton, HeaderList, MultiImageUploader, SelectOption } from "@/components/ui";
import { CadastroCursoDataForm } from "@/interfaces/cadastroCurso";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, TextInput, View } from "react-native";

const optionsHabilidades: SelectOption[] = [
  { label: 'Habilidade 01', value: 1 },
  { label: 'Habilidade 02', value: 2 },
  { label: 'Habilidade 03', value: 3 },
];

const defaultValuesCadatroCurso: CadastroCursoDataForm = {
  nome: "",
  plataformaInstituicao: "",
  dataConclusao: "",
  emAndamento: false,
  cargaHoraria: "",
  habilidadeSelecionada: undefined,
  habilidadesDesenvolvidas: [],
  link: "",
  imagens: [],
}

export default function CadastroCurso() {
  const router = useRouter();
  const inputPlataformaInstituicaoRef = useRef<TextInput>(null);
  const inputDataConclusaoRef = useRef<TextInput>(null);

  const {
    control,
    watch,
    getValues,
    setValue
  } = useForm<CadastroCursoDataForm>({
    defaultValues: defaultValuesCadatroCurso
  });

  function onAddHabilidade() {
    if (watch().habilidadeSelecionada) {
      const habilidadeSelecionada: number = getValues().habilidadeSelecionada ?? 0;
      const findedHabilidade = getValues().habilidadesDesenvolvidas.find((habilidade) => habilidade === watch().habilidadeSelecionada);

      if (!findedHabilidade) {
        setValue("habilidadesDesenvolvidas", [...getValues().habilidadesDesenvolvidas, habilidadeSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    setValue("habilidadeSelecionada", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveHabilidade(habilidade: number) {
    const filteredCategorias = getValues().habilidadesDesenvolvidas.filter((item) => item !== habilidade);
    setValue("habilidadesDesenvolvidas", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className='w-full flex flex-1 pt-10 px-8 pb-8'>
          <HeaderList
            onPressAdd={() => {
              //
            }}
            title="Cadastrar curso"
            onBack={() => {
              router.push('/cursos')
            }}
            disabledAdd
          />

          <ScrollView className="mt-14" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 4, paddingHorizontal: 4 }}>
            <ControlledInput
              control={control}
              label='Nome do curso'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputPlataformaInstituicaoRef?.current?.focus()}
            />
            <ControlledInput
              ref={inputPlataformaInstituicaoRef}
              control={control}
              label='Plataforma ou instituição'
              name='plataformaInstituicao'
              placeholder='Plataforma ou instituição'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputDataConclusaoRef?.current?.focus()}
            />
            <ControlledInput
              ref={inputDataConclusaoRef}
              control={control}
              label='Data de conclusão'
              name='dataConclusão'
              placeholder='dd/mm/yyyy'
              className='mb-4'
              type='date'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Carga horária'
              name='cargaHoraria'
              placeholder='Carga horária'
              className='mb-4'
              returnKeyType='next'
            />
            <Controller
              control={control}
              name="emAndamento"
              
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  label="Em andamento"
                  value={value}
                  onChange={onChange}
                  className="mb-4"
                />
              )}
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades Desenvolvidas'
                name='habilidadeSelecionada'
                placeholder='Habilidade'
                className='w-4/5'
                options={optionsHabilidades}
              />
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddHabilidade}>
                <Ionicons name="add-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row w-full flex-wrap">
              {getValues().habilidadesDesenvolvidas?.map((habilidade, index) => (
                <BadgeClose
                  key={index}
                  name={optionsHabilidades?.find((option) => option.value === habilidade)?.label ?? ''}
                  onPress={() => {
                    onRemoveHabilidade(habilidade);
                  }}
                />
              ))}
            </View>
            <ControlledInput
              control={control}
              label='Link do curso'
              name='link'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
            />
            <ThemedText className='mb-2'>Upload de imagens</ThemedText>
            <MultiImageUploader
              images={watch().imagens}
              setImages={(images) => setValue('imagens', images)}
            />
          </ScrollView>
          <CustomButton
            title='Salvar'
            onPress={() => {
              //
            }}
            className="w-full mb-2 mt-auto"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}