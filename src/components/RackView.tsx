/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { 
  Page, 
  PageSection, 
  Title, 
  Flex, 
  FlexItem, 
  BackToTop,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  //Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Divider
} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { Device, generateMockDevices } from '../types';
import { 
  CubesIcon, 
  BoltIcon, 
  TemperatureHighIcon,
  ServerIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons';

interface DeviceSummary {
  name: string;
  watts: number;
  btuPerHour: number;
  rackId: string;
  status: 'normal' | 'warning' | 'critical';
  serviceTag: string;
}

export default function RackOverviewPage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin');
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceSummaries, setDeviceSummaries] = useState<DeviceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const rackId = 'rack-1';
  const version = 'Version: v0.0.1';

  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        const mockDevices = generateMockDevices();

        console.log(devices.length)
        setDevices(mockDevices);
        
        // Transform devices into summary format
        const summaries: DeviceSummary[] = mockDevices.map(device => {
          const totalWatts = device.powerControls.reduce(
            (sum, control) => sum + control.PowerConsumedWatts, 0
          );
          const totalBtu = totalWatts * 3.41;
          
          // Determine status based on power usage
          const maxCapacity = device.powerControls.reduce(
            (sum, control) => sum + control.PowerCapacityWatts, 0
          );
          const usagePercentage = (totalWatts / maxCapacity) * 100;
          
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          if (usagePercentage > 100) {
            status = 'critical';
          } else if (usagePercentage > 85) {
            status = 'warning';
          }
          
          return {
            name: device.name,
            watts: totalWatts,
            btuPerHour: totalBtu,
            rackId: rackId,
            status: status,
            serviceTag: device.serviceTag
          };
        });
        
        setDeviceSummaries(summaries);
        setError(null);
      } catch (err) {
        setError('Failed to load device data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeviceData();
  }, []);

  // Calculate cumulative values
  const totalWatts = deviceSummaries.reduce((sum, device) => sum + device.watts, 0);
  const totalBtuPerHour = deviceSummaries.reduce((sum, device) => sum + device.btuPerHour, 0);
  const deviceCount = deviceSummaries.length;
  const criticalDevices = deviceSummaries.filter(d => d.status === 'critical').length;
  const warningDevices = deviceSummaries.filter(d => d.status === 'warning').length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} {version}</div>;
  }

  const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
    const variants = {
      normal: { variant: 'outline', color: '#28a745', bg: '#d4edda', text: 'Normal' },
      warning: { variant: 'outline', color: '#ffc107', bg: '#fff3cd', text: 'Warning' },
      critical: { variant: 'outline', color: '#dc3545', bg: '#f8d7da', text: 'Critical' }
    };
    const config = variants[status];
    
    return (
      <Badge 
        style={{ 
          backgroundColor: config.bg, 
          color: config.color,
          border: `1px solid ${config.color}`,
          fontWeight: 600,
          padding: '4px 8px'
        }}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title data-test="rack-overview-title">{t('Rack Overview')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light" className="page-header">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" className="page-title">
                {t('Rack Overview')}
              </Title>
              <div style={{ 
                marginTop: '8px',
                fontSize: '1.1rem',
                opacity: 0.9,
                fontWeight: 400
              }}>
                {rackId.toUpperCase()} • Power & Thermal Management
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ fontSize: '14px' }}>Last Updated</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </FlexItem>
          </Flex>
        </PageSection>

        <PageSection variant="light" className="page-background">
          {deviceSummaries.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No Devices Found in Rack
              </Title>
              <EmptyStateBody>
                No devices available in {rackId}. Add devices to monitor their power usage and thermal output.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <>
              {/* Cumulative Summary Section */}
              <div style={{ marginBottom: '32px' }}>
                <Title headingLevel="h2" className="section-title" style={{ marginBottom: '24px' }}>
                  📊 Rack Summary
                </Title>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Total Power Card */}
                  <Card className="summary-card" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
                  }}>
                    <CardBody style={{ padding: '24px', textAlign: 'center' }}>
                      <BoltIcon style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="lg" style={{ color: 'white', marginBottom: '8px' }}>
                        Total Power
                      </Title>
                      <div style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '4px' }}>
                        {totalWatts.toFixed(1)}
                      </div>
                      <div style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 500 }}>
                        Watts
                      </div>
                    </CardBody>
                  </Card>

                  {/* Total Heat Output Card */}
                  <Card className="summary-card" style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(240, 147, 251, 0.25)'
                  }}>
                    <CardBody style={{ padding: '24px', textAlign: 'center' }}>
                      <TemperatureHighIcon style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="lg" style={{ color: 'white', marginBottom: '8px' }}>
                        Heat Output
                      </Title>
                      <div style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '4px' }}>
                        {totalBtuPerHour.toFixed(0)}
                      </div>
                      <div style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 500 }}>
                        BTU/hr
                      </div>
                    </CardBody>
                  </Card>

                  {/* Device Count Card */}
                  <Card className="summary-card" style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(79, 172, 254, 0.25)'
                  }}>
                    <CardBody style={{ padding: '24px', textAlign: 'center' }}>
                      <ServerIcon style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="lg" style={{ color: 'white', marginBottom: '8px' }}>
                        Active Devices
                      </Title>
                      <div style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '4px' }}>
                        {deviceCount}
                      </div>
                      <div style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 500 }}>
                        Devices
                      </div>
                    </CardBody>
                  </Card>

                  {/* Status Summary Card */}
                  <Card className="summary-card" style={{
                    background: criticalDevices > 0 
                      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                      : warningDevices > 0 
                      ? 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)'
                      : 'linear-gradient(135deg, #26de81 0%, #20bf6b 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: criticalDevices > 0 
                      ? '0 8px 24px rgba(255, 107, 107, 0.25)'
                      : warningDevices > 0 
                      ? '0 8px 24px rgba(254, 202, 87, 0.25)'
                      : '0 8px 24px rgba(38, 222, 129, 0.25)'
                  }}>
                    <CardBody style={{ padding: '24px', textAlign: 'center' }}>
                      <ExclamationTriangleIcon style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="lg" style={{ color: 'white', marginBottom: '8px' }}>
                        Health Status
                      </Title>
                      <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                        {criticalDevices > 0 && <div>🔴 {criticalDevices} Critical</div>}
                        {warningDevices > 0 && <div>🟡 {warningDevices} Warning</div>}
                        {criticalDevices === 0 && warningDevices === 0 && <div>✅ All Normal</div>}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Device Table Section */}
              <div>
                <Title headingLevel="h2" className="section-title" style={{ marginBottom: '24px' }}>
                  🖥️ Device Details
                </Title>
                
                <Card className="device-card-enhanced">
                  <CardHeader>
                    <CardTitle>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Title headingLevel="h3" size="lg">
                            {rackId.toUpperCase()} Device Inventory
                          </Title>
                        </FlexItem>
                        <FlexItem>
                          <Badge style={{ 
                            backgroundColor: '#e3f2fd', 
                            color: '#1976d2', 
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: 600
                          }}>
                            {deviceCount} Devices
                          </Badge>
                        </FlexItem>
                      </Flex>
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ padding: '0' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="device-summary-table" style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px'
                      }}>
                        <thead>
                          <tr style={{ 
                            backgroundColor: '#f8f9fa',
                            borderBottom: '2px solid #dee2e6'
                          }}>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Device Name
                            </th>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Service Tag
                            </th>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'right',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Power (W)
                            </th>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'right',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Heat (BTU/hr)
                            </th>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'center',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Rack ID
                            </th>
                            <th style={{ 
                              padding: '16px',
                              textAlign: 'center',
                              fontWeight: 600,
                              color: '#495057'
                            }}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deviceSummaries.map((device, index) => (
                            <tr 
                              key={index}
                              style={{ 
                                borderBottom: '1px solid #e9ecef',
                                transition: 'background-color 0.2s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <td style={{ 
                                padding: '16px',
                                fontWeight: 600,
                                color: '#2c3e50'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <ServerIcon style={{ marginRight: '8px', color: '#6c757d' }} />
                                  {device.name}
                                </div>
                              </td>
                              <td style={{ 
                                padding: '16px',
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                color: '#6c757d'
                              }}>
                                {device.serviceTag}
                              </td>
                              <td style={{ 
                                padding: '16px',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: device.status === 'critical' ? '#dc3545' : '#2980b9'
                              }}>
                                {device.watts.toFixed(1)}
                              </td>
                              <td style={{ 
                                padding: '16px',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: '#d68910'
                              }}>
                                {device.btuPerHour.toFixed(0)}
                              </td>
                              <td style={{ 
                                padding: '16px',
                                textAlign: 'center'
                              }}>
                                <Badge style={{
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  fontFamily: 'monospace',
                                  padding: '4px 8px',
                                  fontSize: '12px'
                                }}>
                                  {device.rackId}
                                </Badge>
                              </td>
                              <td style={{ 
                                padding: '16px',
                                textAlign: 'center'
                              }}>
                                {getStatusBadge(device.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </>
          )}
        </PageSection>
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
}

