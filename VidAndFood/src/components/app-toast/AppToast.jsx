import { Box, HStack, VStack, Text, Icon, CloseButton } from "@chakra-ui/react";

import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const statusConfig = {
  success: {
    icon: FaCheckCircle,
    accent: "#16a34a",
    bg: "green.50",
    fg: "green.900",
  },
  error: {
    icon: FaTimesCircle,
    accent: "#ff0000ff",
    bg: "#fc8080ff",
    fg: "red.900",
  },
  info: {
    icon: FaInfoCircle,
    accent: "#2563eb",
    bg: "blue.50",
    fg: "blue.900",
  },
  warning: {
    icon: FaExclamationTriangle,
    accent: "#d97706",
    bg: "yellow.50",
    fg: "yellow.900",
  },
};

const AppToast = ({ status = "info", title, description, onClose }) => {
  const cfg = statusConfig[status] ?? statusConfig.info;

  return (
    <Box
      w="full"
      maxW="520px"
      mx="auto"
      borderRadius="xl"
      bg={cfg.bg}
      border="1px solid"
      borderColor={`${cfg.accent}33`}
      boxShadow="lg"
      p={4}
    >
      <HStack align="flex-start" spacing={3}>
        <Icon as={cfg.icon} boxSize={6} color={cfg.accent} mt={1} />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="semibold" color={cfg.fg}>
            {title}
          </Text>
          {description ? (
            <Text fontSize="sm" color="#374151">
              {description}
            </Text>
          ) : null}
        </VStack>
        <CloseButton onClick={onClose} />
      </HStack>
    </Box>
  );
};

export default AppToast;
