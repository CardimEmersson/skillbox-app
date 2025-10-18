import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, CustomButton, HeaderList, SelectOption } from "@/components/ui";
import { CadastroMetaDataForm } from "@/interfaces/cadastroMeta";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, TextInput, View } from "react-native";

const optionsHabilidades: SelectOption[] = [
  { label: 'Habilidade 01', value: 1 },
  { label: 'Habilidade 02', value: 2 },
  { label: 'Habilidade 03', value: 3 },
];

const optionsStatus: SelectOption[] = [
  { label: 'Planejado', value: 'planejado' },
  { label: 'Em andamento', value: 'em andamento' },
  { label: 'Concluído', value: 'concluído' },
];

const defaultValuesCadatroMeta: CadastroMetaDataForm = {
  descricao: "",
  habilidadeSelecionada: undefined,
  habilidadesRelacionadas: [],
  prazoConclusão: "",
  status: "planejado",
  titulo: "",
}

export default function CadastroMeta() {
  const router = useRouter();
  const inputDescricaoRef = useRef<TextInput>(null);

  const {
    control,
    watch,
    getValues,
    setValue
  } = useForm<CadastroMetaDataForm>({
    defaultValues: defaultValuesCadatroMeta
  });

  function onAddHabilidade() {
    if (watch().habilidadeSelecionada) {
      const habilidadeSelecionada: number = getValues().habilidadeSelecionada ?? 0;
      const findedHabilidade = getValues().habilidadesRelacionadas.find((habilidade) => habilidade === watch().habilidadeSelecionada);

      if (!findedHabilidade) {
        setValue("habilidadesRelacionadas", [...getValues().habilidadesRelacionadas, habilidadeSelecionada], {
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
    const filteredCategorias = getValues().habilidadesRelacionadas.filter((item) => item !== habilidade);
    setValue("habilidadesRelacionadas", filteredCategorias, {
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
            title="Cadastrar meta"
            onBack={() => {
              router.push('/metas')
            }}
            disabledAdd
          />

          <ScrollView className="mt-14" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 4, paddingHorizontal: 4 }}>
            <ControlledInput
              control={control}
              label='Título da meta'
              name='titulo'
              placeholder='Título'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputDescricaoRef?.current?.focus()}
            />
            <ControlledInput
              ref={inputDescricaoRef}
              control={control}
              label='Descrição'
              name='descricao'
              placeholder='Descrição'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades relacionadas'
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
              {getValues().habilidadesRelacionadas?.map((habilidade, index) => (
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
              label='Prazo de conclusão'
              name='prazoConclusao'
              placeholder='dd/mm/yyyy'
              className='mb-4'
              type='date'
              returnKeyType='next'
            />
            <ControlledSelect
              control={control}
              label='Status da meta'
              name='status'
              placeholder='Planejado'
              className='mb-4'
              returnKeyType='next'
              options={optionsStatus}
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