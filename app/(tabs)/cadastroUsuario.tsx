import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, CustomButton, HeaderList, SelectOption } from "@/components/ui";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { CadastroUsuarioDataForm } from "@/interfaces/cadastroUsuario";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

const optionsNivelFormacao: SelectOption[] = [
  { label: 'Fundamental', value: 'fundamental' },
  { label: 'Médio', value: 'medio' },
  { label: 'Técnico', value: 'tecnico' },
  { label: 'Graduação', value: 'graduacao' },
  { label: 'Pós graduação', value: 'pos_graduacao' },
  { label: 'Mestrado', value: 'mestrado' },
  { label: 'Doutorado', value: 'doutorado' },
];

const defaultValuesCadastroUsuario: CadastroUsuarioDataForm = {
  nome: "",
  sobrenome: "",
  email: "",
  localizacao: "",
  dataNascimento: "",
  nivelFormacao: "fundamental",
  instituicao: "",
  objetivoProfissional: "",
  areaSelecionada: undefined,
  areasUtilizadas: [],
  bio: "",
  linkedin: "",
  github: "",
  site: "",
  imagem: "",
}

export default function CadastroUsuario() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>("");

  const {
    control,
    watch,
    getValues,
    setValue
  } = useForm<CadastroUsuarioDataForm>({
    defaultValues: defaultValuesCadastroUsuario
  });

  function onAddArea() {
    if (watch().areaSelecionada) {
      const areaSelecionada: number = getValues().areaSelecionada ?? 0;
      const findedArea = getValues().areasUtilizadas.find((categoria) => categoria === watch().areaSelecionada);

      if (!findedArea) {
        setValue("areasUtilizadas", [...getValues().areasUtilizadas, areaSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    setValue("areaSelecionada", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveArea(area: number) {
    const filteredAreas = getValues().areasUtilizadas.filter((item) => item !== area);
    setValue("areasUtilizadas", filteredAreas, {
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-grow w-full pt-10 px-8 pb-8"
          automaticallyAdjustKeyboardInsets
        >
          <HeaderList
            onPressAdd={() => {
              //
            }}
            title="Perfil"
            onBack={() => {
              router.push('/usuario')
            }}
            disabledAdd
          />

          <View className="w-full items-center mb-6 mt-6">
            <ImageUploader image={image} setImage={setImage} />
          </View>

          <Text className="text-xl font-inter-bold mb-6 color-text">Informações pessoais</Text>
          <View>
            <ControlledInput
              control={control}
              label='Nome'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Sobrenome'
              name='sobrenome'
              placeholder='Sobrenome'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              // ref={inputEmailRef}
              control={control}
              label='Email'
              name='email'
              placeholder='@email.com'
              keyboardType='email-address'
              className='mb-4'
              returnKeyType='next'
            // onSubmitEditing={() => focusInput('dataNascimento')}
            />
            <ControlledInput
              control={control}
              label='Localização (cidade/estado)'
              name='localizacao'
              placeholder='Localização'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Data de nascimento'
              name='dataNascimento'
              placeholder='dd/mm/yyyy'
              className='mb-4'
              type='date'
              returnKeyType='next'
            />

            <Text className="text-xl font-inter-bold my-6 color-text">Perfil profissional / Acadêmico</Text>

            <ControlledSelect
              control={control}
              label='Nível de formação'
              name='nivelFormacao'
              placeholder='Fundamental'
              className='mb-4'
              returnKeyType='next'
              options={optionsNivelFormacao}
            />
            <ControlledInput
              control={control}
              label='Instituição de ensino'
              name='instituicao'
              placeholder='Instituição'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Objetivo profissional'
              name='objetivoProfissional'
              placeholder='Objetivo profissional'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View className="flex flex-row items-center justify-between mb-4 w-full">
              <ControlledSelect
                control={control}
                label='Área de interesse'
                name='areaSelecionada'
                placeholder='Área'
                className='w-3/4'
                options={[]}
              />
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddArea}>
                <Ionicons name="add-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row w-full flex-wrap">
              {getValues().areasUtilizadas?.map((area, index) => (
                <BadgeClose
                  key={index}
                  // name={optionsCategorias?.find((option) => option.value === categoria)?.label ?? ''}
                  name=""
                  onPress={() => {
                    onRemoveArea(area);
                  }}
                />
              ))}
            </View>
            <ControlledInput
              control={control}
              label='Bio / sobre você'
              name='bio'
              placeholder='Bio'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text className="text-xl font-inter-bold my-6 color-text">Links pessoais / portifólio</Text>

            <ControlledInput
              control={control}
              label='Linkedin'
              name='linkedin'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Github'
              name='github'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledInput
              control={control}
              label='Site pessoal / Portifólio'
              name='site'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
            />

            <CustomButton
              title='Salvar'
              onPress={() => {
                //
              }}
              className="w-full mb-2 mt-auto"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}