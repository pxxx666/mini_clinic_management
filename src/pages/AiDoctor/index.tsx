import { streamChat } from '@/services/ai';
import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './styles.less';

const { TextArea } = Input;

const Overview: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) {
      message.warning('请输入您的症状描述');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      abortController.current = new AbortController();

      await streamChat(
        input,
        (chunk) => {
          setResponse((prev) => prev + chunk);
        },
        abortController.current.signal,
      );
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        message.error('抱歉，服务出现错误');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="AI医疗咨询助手">
        <div className={styles.inputSection}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请详细描述您的症状..."
            className={styles.textarea}
            rows={4}
          />
          <div className={styles.buttonGroup}>
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={loading}
              onClick={loading ? handleStop : handleSubmit}
            >
              {loading ? '停止生成' : '开始咨询'}
            </Button>
          </div>
        </div>
        <div className={styles.responseSection}>
          {!response ? (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>👨‍⚕️</div>
              <div className={styles.placeholderTitle}>AI医生随时待命</div>
              <div className={styles.placeholderText}>
                请在上方详细描述您的症状，我会为您提供专业的建议
              </div>
            </div>
          ) : (
            <div className={styles.responseContent}>{response}</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Overview;
