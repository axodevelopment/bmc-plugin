/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Title, Flex, FlexItem, BackToTop,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  Card,
  CardBody
} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { Device, generateMockDevices } from '../types';
import { CubesIcon } from '@patternfly/react-icons';

export default function ExamplePage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin');

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const version = 'Version: v0.0.1'

  useEffect(() => {
    const getBmcData = async () => {
      const devices = generateMockDevices();
      setDevices(devices);
    };

    getBmcData();
    setError(null)
    setIsLoading(false)
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} {version}</div>;
  }

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Dashboard')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light" className="page-header">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Title headingLevel="h1" className="page-title">
                {t('Device Dashboard')}
              </Title>
            </FlexItem>
          </Flex>
        </PageSection>
        <PageSection variant="light" className="page-background">
          {devices.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No Devices Found
              </Title>
              <EmptyStateBody>
                No devices available. Add devices to monitor their power usage and networking details.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <div className="devices-grid">
              {devices.map((device, deviceIndex) => (
                <Card key={deviceIndex} className="device-card-enhanced">
                  <CardBody style={{ padding: '32px' }}>
                    {/* Device Header with Action Button */}
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '32px' }}>
                      <FlexItem>
                        <Title 
                          headingLevel="h2" 
                          size="xl" 
                          className="gradient-text"
                          style={{ 
                            fontWeight: 600,
                            marginBottom: '8px'
                          }}
                        >
                          {device.name}
                        </Title>
                        <div className="device-label">
                          LABEL: {device.serviceTag}
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <Button 
                          variant="primary" 
                          onClick={() => alert(`Graceful Reboot for ${device.name}`)}
                          className="reboot-button"
                        >
                          Graceful Reboot
                        </Button>
                      </FlexItem>
                    </Flex>

                    {/* Power Controls Section */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title headingLevel="h3" size="lg" className="section-title">
                        ⚡ Power Controls
                      </Title>
                      <div className="power-controls-grid">
                        {device.powerControls.map((control, controlIndex) => {
                          const powerUsagePercentage = (control.PowerConsumedWatts / control.PowerCapacityWatts) * 100;
                          const isOverCapacity = powerUsagePercentage > 100;
                          const btuPerHour = control.PowerConsumedWatts * 3.41;

                          // SVG Pie Chart calculation
                          const radius = 45;
                          const circumference = 2 * Math.PI * radius;
                          const strokeDasharray = `${(powerUsagePercentage / 100) * circumference} ${circumference}`;

                          return (
                            <div
                              key={controlIndex}
                              className={`power-control-card ${isOverCapacity ? 'power-control-over-capacity flash' : 'power-control-normal'}`}
                            >
                              <Title headingLevel="h4" size="lg" style={{ 
                                marginBottom: '20px', 
                                color: '#2c3e50',
                                textAlign: 'center',
                                fontWeight: 600
                              }}>
                                {control.Name}
                              </Title>
                              
                              <div className="power-control-layout">
                                
                                {/* Power Details */}
                                <div className="power-metrics-card">
                                  <h5 className="power-metrics-header">
                                    Power Metrics
                                  </h5>
                                  <div style={{ fontSize: '14px', lineHeight: '2' }}>
                                    <div className={`power-metric-item ${isOverCapacity ? 'power-metric-consumed-over' : 'power-metric-consumed'}`}>
                                      <span style={{ fontWeight: 600 }}>Currently Consumed:</span>
                                      <strong style={{ 
                                        color: isOverCapacity ? '#e74c3c' : '#2980b9',
                                        fontSize: '16px'
                                      }}>
                                        {control.PowerConsumedWatts.toFixed(2)} W
                                      </strong>
                                    </div>
                                    <div className="power-metric-item power-metric-capacity">
                                      <span style={{ fontWeight: 600 }}>Power Capacity:</span>
                                      <strong style={{ fontSize: '16px', color: '#27ae60' }}>
                                        {control.PowerCapacityWatts.toFixed(2)} W
                                      </strong>
                                    </div>
                                  </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="pie-chart-container">
                                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                                    <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                      {/* Background circle */}
                                      <circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="8"
                                      />
                                      {/* Progress circle */}
                                      <circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        fill="none"
                                        stroke={isOverCapacity ? '#e74c3c' : '#3498db'}
                                        strokeWidth="8"
                                        strokeDasharray={strokeDasharray}
                                        strokeLinecap="round"
                                        style={{
                                          transition: 'stroke-dasharray 1s ease-in-out',
                                        }}
                                      />
                                    </svg>
                                    <div className="pie-chart-center">
                                      <div className={`pie-chart-percentage ${isOverCapacity ? 'status-over-capacity' : 'status-normal'}`} style={{
                                        color: isOverCapacity ? '#e74c3c' : '#3498db'
                                      }}>
                                        {powerUsagePercentage.toFixed(1)}%
                                      </div>
                                      <div className="pie-chart-label">
                                        USAGE
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`status-badge ${isOverCapacity ? 'status-over-capacity' : 'status-normal'}`}>
                                    {isOverCapacity ? 'OVER CAPACITY' : 'NORMAL OPERATION'}
                                  </div>
                                </div>

                                {/* BTU/hr Display */}
                                <div className="btu-display">
                                  <h5 className="btu-header">
                                    Heat Output
                                  </h5>
                                  <div className="btu-value-container">
                                    <div className="btu-value">
                                      {btuPerHour.toFixed(0)}
                                    </div>
                                    <div className="btu-unit">
                                      BTU/hr
                                    </div>
                                    <div className="btu-description">
                                      Thermal Energy Output
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Device Details and Networking in Grid Layout */}
                    <div className="details-grid">
                      
                      {/* Device Details Section */}
                      <div>
                        <Title headingLevel="h3" size="lg" className="subsection-title">
                          🖥️ Device Details
                        </Title>
                        <details className="details-section">
                          <summary className="details-summary">
                            Hardware Information
                          </summary>
                          <div className="details-content">
                            <p className="details-item">
                              <span><b>Service Tag:</b></span>
                              <span className="details-value">
                                {device.serviceTag}
                              </span>
                            </p>
                            <p className="details-item">
                              <span><b>BIOS Version:</b></span>
                              <span className="details-value">
                                {device.biosVersion}
                              </span>
                            </p>
                            <p className="details-item">
                              <span><b>iDRAC Firmware:</b></span>
                              <span className="details-value">
                                {device.idracFirmwareVersion}
                              </span>
                            </p>
                            <p className="details-item">
                              <span><b>IP Address:</b></span>
                              <span className="details-value">
                                {device.ipAddress}
                              </span>
                            </p>
                            <p className="details-item">
                              <span><b>iDRAC MAC:</b></span>
                              <span className="details-value">
                                {device.idracMacAddress}
                              </span>
                            </p>
                          </div>
                        </details>
                      </div>

                      {/* Networking Section */}
                      <div>
                        <Title headingLevel="h3" size="lg" className="subsection-title">
                          🌐 Networking
                        </Title>
                        <details className="details-section">
                          <summary className="details-summary">
                            Network Interfaces ({device.networkInterfaces.filter(nic => nic.linkStatus === "Up").length} Active)
                          </summary>
                          <div className="details-content" style={{ paddingTop: '12px' }}>
                            <table className="network-table">
                              <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Port</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Speed</th>
                                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Protocol</th>
                                </tr>
                              </thead>
                              <tbody>
                                {device.networkInterfaces.map((nic, nicIndex) => (
                                  <React.Fragment key={nicIndex}>
                                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                      <td style={{ padding: '8px', fontWeight: 600 }}>{nic.port}</td>
                                      <td style={{ padding: '8px' }}>
                                        <span className={nic.linkStatus === 'Up' ? 'nic-status-up' : 'nic-status-down'}>
                                          {nic.linkStatus}
                                        </span>
                                      </td>
                                      <td style={{ padding: '8px', fontFamily: 'monospace' }}>{nic.linkSpeed}</td>
                                      <td style={{ padding: '8px' }}>{nic.protocol}</td>
                                    </tr>
                                    {nic.linkStatus === "Up" && (
                                      <tr>
                                        <td colSpan={4} style={{ padding: '0', backgroundColor: '#f8f9fa' }}>
                                          <details style={{ margin: '8px', fontSize: '12px' }}>
                                            <summary style={{ cursor: 'pointer', padding: '4px', color: '#6c757d' }}>
                                              NIC Details
                                            </summary>
                                            <div style={{ padding: '8px', backgroundColor: 'white', margin: '4px', borderRadius: '4px' }}>
                                              <p><b>OS Driver State:</b> {nic.partitionProperties.osDriverState}</p>
                                              <p><b>LAN Driver Version:</b> {nic.partitionProperties.lanDriverVersion}</p>
                                              <p><b>PCI Device ID:</b> {nic.partitionProperties.pciDeviceId}</p>
                                              <p><b>Physical MAC:</b> {nic.macAddresses.physical}</p>
                                              <p><b>Virtual MAC:</b> {nic.macAddresses.virtual}</p>
                                            </div>
                                          </details>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </PageSection>
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
}