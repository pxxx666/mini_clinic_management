import { streamChat } from '@/services/ai';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Input, message, Row } from 'antd';
import DOMPurify from 'dompurify';
import 'github-markdown-css/github-markdown-light.css';
import { marked } from 'marked';
import React, { useRef, useState } from 'react';
import styles from './styles.less';

const { TextArea } = Input;

const ConsultationPage: React.FC = () => {
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

  const features = [
    {
      icon: '🕒',
      title: '24小时在线',
      description: '随时随地为您提供专业医疗咨询服务',
    },
    {
      icon: '🤖',
      title: 'AI智能诊断',
      description: '基于深度学习模型，提供准确的初步诊断建议',
    },
    {
      icon: '💊',
      title: '专业建议',
      description: '提供科学的治疗建议和注意事项',
    },
  ];

  return (
    <PageContainer>
      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className={styles.features}>
              {features.map((feature, index) => (
                <Card key={index} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              ))}
            </div>
          </Col>
          <Col span={24}>
            <Card className={styles.mainCard}>
              <div className={styles.tipBox}>
                <h4>💡 使用提示</h4>
                <p>
                  请尽可能详细地描述您的症状，包括：持续时间、具体部位、伴随症状等，这将帮助AI更准确地进行分析。
                </p>
              </div>
              <div className={styles.inputSection}>
                <div className={styles.inputWrapper}>
                  <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="例如：最近三天持续发烧38度，伴有咳嗽和喉咙痛，没有其他明显症状..."
                    className={styles.textarea}
                    rows={4}
                  />
                </div>
                <button
                  type="button"
                  className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                  onClick={loading ? handleStop : handleSubmit}
                  disabled={loading}
                >
                  <span className={styles.buttonContent}>
                    {loading ? (
                      <>
                        <div className={styles.loadingAnimation}></div>
                        停止生成
                      </>
                    ) : (
                      <>
                        <span className={styles.sendIcon}>✉️</span>
                        开始咨询
                      </>
                    )}
                  </span>
                </button>
              </div>
              <div className={styles.responseSection}>
                {!response ? (
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>👨‍⚕️</div>
                    <div className={styles.placeholderTitle}>AI医生随时待命</div>
                    <div className={styles.placeholderText}>
                      请在上方描述您的症状，我会为您提供专业的建议
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.responseContent} markdown-body`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        marked.parse(response || '', {
                          breaks: true,
                          gfm: true,
                          headerIds: false,
                        }),
                      ),
                    }}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default ConsultationPage;
