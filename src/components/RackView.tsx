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
  ExclamationTriangleIcon,
  InfoCircleIcon,
  ArrowRightIcon,
  ClockIcon
} from '@patternfly/react-icons';

interface DeviceSummary {
  name: string;
  watts: number;
  btuPerHour: number;
  rackId: string;
  status: 'normal' | 'warning' | 'critical';
  serviceTag: string;
}

interface MigrationAlert {
  id: string;
  workloadType: 'vm' | 'pod';
  workloadName: string;
  namespace?: string;
  sourceNode: string;
  targetNode: string;
  reason: string;
  timestamp: Date;
  status: 'in-progress' | 'completed' | 'failed';
  powerThreshold: number;
  currentPower: number;
}

export default function RackOverviewPage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin');
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceSummaries, setDeviceSummaries] = useState<DeviceSummary[]>([]);
  const [migrationAlerts, setMigrationAlerts] = useState<MigrationAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const rackId = 'rack-1';
  const version = 'Version: v0.0.1';

  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        const mockDevices = generateMockDevices();
        setDevices(mockDevices);

        console.log(devices.length)
        
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
        
        // Generate mock migration alerts
        const mockAlerts: MigrationAlert[] = [
          {
            id: 'alert-001',
            workloadType: 'vm',
            workloadName: 'web-server-vm-01',
            namespace: 'production',
            sourceNode: 'worker-node-01',
            targetNode: 'worker-node-03',
            reason: 'Power limit exceeded (1100W threshold)',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            status: 'completed',
            powerThreshold: 1100,
            currentPower: 1247
          },
          {
            id: 'alert-002',
            workloadType: 'pod',
            workloadName: 'database-cluster-pod-2',
            namespace: 'databases',
            sourceNode: 'worker-node-02',
            targetNode: 'worker-node-04',
            reason: 'BTU limit exceeded for cooling zone',
            timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
            status: 'in-progress',
            powerThreshold: 950,
            currentPower: 1034
          },
          {
            id: 'alert-003',
            workloadType: 'vm',
            workloadName: 'analytics-vm-05',
            namespace: 'analytics',
            sourceNode: 'worker-node-01',
            targetNode: 'worker-node-05',
            reason: 'Thermal threshold exceeded',
            timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
            status: 'failed',
            powerThreshold: 1000,
            currentPower: 1156
          }
        ];
        
        setMigrationAlerts(mockAlerts);
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px',
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
                    <CardBody style={{ padding: '16px', textAlign: 'center' }}>
                      <BoltIcon style={{ fontSize: '1.8rem', marginBottom: '8px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="md" style={{ color: 'white', marginBottom: '6px', fontSize: '1rem' }}>
                        Total Power
                      </Title>
                      <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2px' }}>
                        {totalWatts.toFixed(1)}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 500 }}>
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
                      <TemperatureHighIcon style={{ fontSize: '1.8rem', marginBottom: '8px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="md" style={{ color: 'white', marginBottom: '6px', fontSize: '1rem' }}>
                        Heat Output
                      </Title>
                      <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2px' }}>
                        {totalBtuPerHour.toFixed(0)}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 500 }}>
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
                      <ServerIcon style={{ fontSize: '1.8rem', marginBottom: '8px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="md" style={{ color: 'white', marginBottom: '6px', fontSize: '1rem' }}>
                        Active Devices
                      </Title>
                      <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2px' }}>
                        {deviceCount}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 500 }}>
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
                      <ExclamationTriangleIcon style={{ fontSize: '1.8rem', marginBottom: '8px', opacity: 0.9 }} />
                      <Title headingLevel="h3" size="md" style={{ color: 'white', marginBottom: '6px', fontSize: '1rem' }}>
                        Health Status
                      </Title>
                      <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        {criticalDevices > 0 && <div>🔴 {criticalDevices} Critical</div>}
                        {warningDevices > 0 && <div>🟡 {warningDevices} Warning</div>}
                        {criticalDevices === 0 && warningDevices === 0 && <div>✅ All Normal</div>}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              {/* Migration Alerts Section */}
              <div style={{ marginBottom: '32px' }}>
                <Title headingLevel="h2" className="section-title" style={{ marginBottom: '24px' }}>
                  🚨 Workload Migration Alerts
                </Title>
                
                {migrationAlerts.length === 0 ? (
                  <Card style={{
                    border: '2px dashed #d1ecf1',
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <CardBody style={{ padding: '32px', textAlign: 'center' }}>
                      <InfoCircleIcon style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '12px' }} />
                      <Title headingLevel="h4" size="md" style={{ color: '#6c757d', marginBottom: '8px' }}>
                        No Active Migration Alerts
                      </Title>
                      <div style={{ color: '#6c757d', fontSize: '14px' }}>
                        All workloads are operating within power and thermal limits
                      </div>
                    </CardBody>
                  </Card>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {migrationAlerts.map((alert) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'completed': return { bg: '#d4edda', border: '#28a745', text: '#155724' };
                          case 'in-progress': return { bg: '#fff3cd', border: '#ffc107', text: '#856404' };
                          case 'failed': return { bg: '#f8d7da', border: '#dc3545', text: '#721c24' };
                          default: return { bg: '#f8f9fa', border: '#6c757d', text: '#495057' };
                        }
                      };
                      
                      const statusColors = getStatusColor(alert.status);
                      const timeAgo = Math.floor((Date.now() - alert.timestamp.getTime()) / (1000 * 60));
                      
                      return (
                        <Card 
                          key={alert.id}
                          style={{
                            border: `2px solid ${statusColors.border}`,
                            borderRadius: '12px',
                            backgroundColor: statusColors.bg,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <CardBody style={{ padding: '16px' }}>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                              <FlexItem flex={{ default: 'flex_1' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                  <Badge style={{
                                    backgroundColor: alert.workloadType === 'vm' ? '#e3f2fd' : '#f3e5f5',
                                    color: alert.workloadType === 'vm' ? '#1976d2' : '#7b1fa2',
                                    marginRight: '8px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {alert.workloadType}
                                  </Badge>
                                  <Title headingLevel="h4" size="md" style={{ 
                                    margin: 0, 
                                    color: statusColors.text,
                                    fontWeight: 600 
                                  }}>
                                    {alert.workloadName}
                                  </Title>
                                </div>
                                
                                <div style={{ 
                                  fontSize: '14px', 
                                  color: statusColors.text,
                                  marginBottom: '8px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  <span style={{ fontWeight: 600, marginRight: '8px' }}>{alert.sourceNode}</span>
                                  <ArrowRightIcon style={{ margin: '0 8px', fontSize: '12px' }} />
                                  <span style={{ fontWeight: 600 }}>{alert.targetNode}</span>
                                </div>
                                
                                <div style={{ fontSize: '13px', color: statusColors.text, opacity: 0.8 }}>
                                  <strong>Reason:</strong> {alert.reason}
                                </div>
                                
                                {alert.namespace && (
                                  <div style={{ fontSize: '12px', color: statusColors.text, opacity: 0.7, marginTop: '4px' }}>
                                    <strong>Namespace:</strong> {alert.namespace}
                                  </div>
                                )}
                                
                                <div style={{ fontSize: '12px', color: statusColors.text, opacity: 0.7, marginTop: '4px' }}>
                                  <strong>Power:</strong> {alert.currentPower}W / {alert.powerThreshold}W limit
                                </div>
                              </FlexItem>
                              
                              <FlexItem>
                                <div style={{ textAlign: 'right' }}>
                                  <Badge style={{
                                    backgroundColor: statusColors.bg,
                                    color: statusColors.text,
                                    border: `1px solid ${statusColors.border}`,
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    textTransform: 'capitalize'
                                  }}>
                                    {alert.status.replace('-', ' ')}
                                  </Badge>
                                  
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: statusColors.text, 
                                    opacity: 0.7,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                  }}>
                                    <ClockIcon style={{ marginRight: '4px', fontSize: '10px' }} />
                                    {timeAgo}m ago
                                  </div>
                                </div>
                              </FlexItem>
                            </Flex>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                )}
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