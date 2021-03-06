import { Flex, Input as ChakraInput, Text, Textarea as ChakraTextarea } from '@chakra-ui/react'

export const Input = (props: any) => (
  <ChakraInput
    textAlign="end"
    fontSize="xl"
    fontWeight="medium"
    borderWidth={0}
    bgColor="purple.900"
    p={6}
    pr={2}
    borderRadius={8}
    _focus={{}}
    {...props}
  />
)

export const Textarea = (props: any) => (
  <ChakraTextarea
    fontSize="xl"
    fontWeight="semibold"
    borderWidth={0}
    bgColor="purple.900"
    p={6}
    pr={3}
    height={28}
    borderRadius={8}
    resize="none"
    _focus={{}}
    {...props}
  />
)

type BalanceInputProps = {
  value: string
  label?: React.ReactNode
  onChange: (e: React.MouseEvent<HTMLInputElement>) => void
  onMaxClick: (e: any) => void
}

export const BalanceInput = ({ value, label, onChange, onMaxClick }: BalanceInputProps) => (
  <Flex w="full" bgColor="purple.900" borderRadius={8} align="center">
    <Flex w="full" position="relative" align="center">
      <Flex
        cursor="pointer"
        position="absolute"
        left={0}
        fontWeight="extrabold"
        fontSize="sm"
        ml={4}
        color="purple.100"
        zIndex="docked"
        onClick={onMaxClick}
        _hover={{ color: '#fff' }}
      >
        MAX
      </Flex>
      <Input value={value} onChange={onChange} placeholder="0" />
    </Flex>
    {typeof label === 'string' ? (
      <Text whiteSpace="nowrap" fontSize="lg" fontWeight="semibold" color="purple.100" align="center" pl={2} pr={4}>
        {label}
      </Text>
    ) : (
      label
    )}
  </Flex>
)
