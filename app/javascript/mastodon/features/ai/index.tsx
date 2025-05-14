import { useCallback, useRef, useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { NavLink, Switch, Route } from 'react-router-dom';
import ExploreIcon from '@/material-icons/400-24px/explore.svg?react';
import { Column } from 'mastodon/components/column';
import type { ColumnRef } from 'mastodon/components/column';
import { ColumnHeader } from 'mastodon/components/column_header';
import { useIdentity } from 'mastodon/identity_context';
import { generateMessageId } from 'mastodon/utils/message_id';
import Statuses from './statuses';

const messages = defineMessages({
  title: { id: 'ai.title', defaultMessage: 'AI Chat' },
  placeholder: { id: 'ai.placeholder', defaultMessage: 'Type your message...' },
  send: { id: 'ai.send', defaultMessage: 'Send' },
  error: { id: 'ai.error', defaultMessage: 'Failed to send message. Please try again.' },
  networkError: { id: 'ai.network_error', defaultMessage: 'Network error. Please check your connection.' },
  loading: { id: 'ai.loading', defaultMessage: 'Sending...' },
});

interface Message {
  id: bigint;
  content: string;
  isUser: boolean;
}

const AI: React.FC<{ multiColumn: boolean }> = ({ multiColumn }) => {
  const { signedIn } = useIdentity();
  const intl = useIntl();
  const columnRef = useRef<ColumnRef>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: generateMessageId(), content: 'Hello! How can I help you today?', isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHeaderClick = useCallback(() => {
    columnRef.current?.scrollTop();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage = { id: generateMessageId(), content: inputValue, isUser: true };
      setChatMessages(prev => [...prev, userMessage]);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const aiMessage = { 
        id: generateMessageId(), 
        content: 'I am a demo AI assistant. This is a placeholder response.', 
        isUser: false 
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setInputValue('');
    } catch (err) {
      const errorMessage = err instanceof Error && err.message === 'Network error'
        ? messages.networkError
        : messages.error;
      setError(intl.formatMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Column ref={columnRef} label={intl.formatMessage(messages.title)}>
      <ColumnHeader
        icon='comments'
        title={intl.formatMessage(messages.title)}
        onClick={handleHeaderClick}
        multiColumn={multiColumn}
      />
      
      <div className='ai-chat'>
        <div className='ai-chat__messages'>
          {chatMessages.map(message => (
            <div
              key={message.id}
              className={`ai-chat__message ${message.isUser ? 'ai-chat__message--user' : 'ai-chat__message--ai'}`}
            >
              <div className='ai-chat__message-content'>
                {message.content}
              </div>
            </div>
          ))}
          {error && (
            <div className='ai-chat__error'>
              {error}
            </div>
          )}
        </div>

        <form className={`ai-chat__input-container ${isLoading ? 'ai-chat__input-container--loading' : ''}`} onSubmit={handleSubmit}>
          <input 
            type='text'
            className='ai-chat__input'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={intl.formatMessage(messages.placeholder)}
            disabled={isLoading}
          />
          <button 
            type='submit'
            className='ai-chat__submit-button button'
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? intl.formatMessage(messages.loading) : intl.formatMessage(messages.send)}
          </button>
        </form>
      </div>

      <Switch>
        <Route path={['/ai', '/ai/posts']} component={Statuses} />
      </Switch>

      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name='robots' content='noindex' />
      </Helmet>
    </Column>
  );
};

export default AI;

