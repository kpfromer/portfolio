import React from 'react';
import { Title } from '../Title';
import { Section } from '../Section';
import { Box, Button } from 'rebass';
import { Label, Input, Textarea } from '@rebass/forms';

export default () => {
  return (
    <Section>
      <Title>Contact</Title>
      <Box as="form" action="https://formspree.io/mdokobow" method="POST">
        <Label htmlFor="email">Your email:</Label>
        <Input id="email" type="email" name="_replyto" required />

        <Label htmlFor="message" mt={3}>
          Your message:
        </Label>
        <Textarea id="message" name="message" required />

        <input type="text" name="_gotcha" style={{ display: 'none' }} />

        <Button type="submit" mt={3} px={4} fontSize={3} sx={{ cursor: 'pointer' }}>
          Send
        </Button>
      </Box>
    </Section>
  );
};