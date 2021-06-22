import Container from '../Container'
import { useDelegates } from '@inverse/hooks/useDelegates'
import { Flex, Image, Stack, Text } from '@chakra-ui/react'
import { Delegate } from '@inverse/types'
import { smallAddress } from '@inverse/util'
import { Avatar } from '../Avatar'

export const DelegatesPreview = () => {
  const { delegates } = useDelegates()

  console.log(delegates)

  return delegates ? (
    <Container w="sm" label="Top Delegates">
      <Stack w="full">
        {delegates.slice(0, 5).map(({ address, balance, delegators, votes }: Delegate) => (
          <Flex cursor="pointer" justify="space-between" p={2} borderRadius={8} _hover={{ bgColor: 'purple.900' }}>
            <Stack direction="row" align="center">
              <Avatar address={address} boxSize={7} />
              <Flex direction="column">
                <Text fontSize="sm" fontWeight="semibold">
                  {smallAddress(address)}
                </Text>
                <Text fontSize="sm" color="purple.100">
                  {`${votes.length} votes`}
                </Text>
              </Flex>
            </Stack>
            <Flex direction="column" align="flex-end">
              <Text fontSize="sm" fontWeight="semibold">
                {balance.toFixed(2)}
              </Text>
              <Text fontSize="sm" color="purple.100">
                {`${delegators.length} delegators`}
              </Text>
            </Flex>
          </Flex>
        ))}
        <Flex
          cursor="pointer"
          w="full"
          p={2}
          justify="center"
          fontSize="xs"
          fontWeight="semibold"
          borderRadius={8}
          textTransform="uppercase"
          color="purple.100"
          _hover={{ bgColor: 'purple.900' }}
        >
          View All
        </Flex>
      </Stack>
    </Container>
  ) : (
    <></>
  )
}