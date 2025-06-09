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
  Button,
  Card,
  CardBody,
  Badge,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Select,
  SelectOption,
  Pagination,
  PaginationVariant,
  Dropdown,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Chip,
  ChipGroup
} from '@patternfly/react-core';
import './example.css';
import { useEffect, useState } from 'react';
import { Device, generateMockDevices } from '../types';
import { 
  ServerIcon,
  SearchIcon} from '@patternfly/react-icons';

interface DeviceListItem {
  id: string;
  name: string;
  serviceTag: string;
  rackId: string;
  watts: number;
  btuPerHour: number;
  status: 'normal' | 'warning' | 'critical';
  biosVersion: string;
  idracFirmwareVersion: string;
  ipAddress: string;
  idracMacAddress: string;
  activeNics: number;
  totalNics: number;
}

type SortField = 'name' | 'watts' | 'btuPerHour' | 'status' | 'rackId';
type SortDirection = 'asc' | 'desc';

export default function DeviceListPage() {
  const { t } = useTranslation('plugin__my-openshift-console-plugin');
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceList, setDeviceList] = useState<DeviceListItem[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and Search
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [rackFilter, setRackFilter] = useState<string[]>([]);
  const [powerRangeFilter, setPowerRangeFilter] = useState<string>('');
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Dropdown states
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const [isRackSelectOpen, setIsRackSelectOpen] = useState(false);
  const [isPowerRangeSelectOpen, setIsPowerRangeSelectOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const version = 'Version: v0.0.1';

  // Generate extended mock data with multiple racks
  const generateExtendedMockDevices = (): Device[] => {
    const baseDevices = generateMockDevices();
    const extendedDevices: Device[] = [];
    
    const racks = ['rack-1', 'rack-2', 'rack-3', 'rack-4'];
    const devicePrefixes = ['GSO', 'GSN', '8FT', 'COJ', 'XTP', 'MLV', 'QRS', 'DEF'];
    
    racks.forEach((rack, rackIndex) => {
      for (let i = 0; i < 6; i++) { // 6 devices per rack
        const prefix = devicePrefixes[Math.floor(Math.random() * devicePrefixes.length)];
        const deviceNum = (rackIndex * 6) + i + 1;
        
        extendedDevices.push({
          ...baseDevices[i % baseDevices.length],
          name: `Device - ${prefix}${deviceNum.toString().padStart(2, '0')}`,
          serviceTag: `${prefix}${deviceNum}DV${rackIndex + 1}`,
          ipAddress: `https://192.168.${30 + rackIndex}.${10 + i}/`
        });
      }
    });
    
    return extendedDevices;
  };

  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        const mockDevices = generateExtendedMockDevices();
        setDevices(mockDevices);

        console.log(devices.length)
        
        // Transform devices into list format with rack assignments
        const deviceListData: DeviceListItem[] = mockDevices.map((device, index) => {
          const rackIndex = Math.floor(index / 6); // 6 devices per rack
          const rackId = `rack-${rackIndex + 1}`;
          
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
          
          const activeNics = device.networkInterfaces.filter(nic => nic.linkStatus === "Up").length;
          
          return {
            id: `device-${index}`,
            name: device.name,
            serviceTag: device.serviceTag,
            rackId: rackId,
            watts: totalWatts,
            btuPerHour: totalBtu,
            status: status,
            biosVersion: device.biosVersion,
            idracFirmwareVersion: device.idracFirmwareVersion,
            ipAddress: device.ipAddress,
            idracMacAddress: device.idracMacAddress,
            activeNics: activeNics,
            totalNics: device.networkInterfaces.length
          };
        });
        
        setDeviceList(deviceListData);
        setFilteredDevices(deviceListData);
        setError(null);
      } catch (err) {
        setError('Failed to load device data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeviceData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...deviceList];
    
    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchLower) ||
        device.serviceTag.toLowerCase().includes(searchLower) ||
        device.ipAddress.toLowerCase().includes(searchLower)
      );
    }
    
    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(device => statusFilter.includes(device.status));
    }
    
    // Rack filter
    if (rackFilter.length > 0) {
      filtered = filtered.filter(device => rackFilter.includes(device.rackId));
    }
    
    // Power range filter
    if (powerRangeFilter) {
      switch (powerRangeFilter) {
        case 'low':
          filtered = filtered.filter(device => device.watts < 200);
          break;
        case 'medium':
          filtered = filtered.filter(device => device.watts >= 200 && device.watts < 400);
          break;
        case 'high':
          filtered = filtered.filter(device => device.watts >= 400);
          break;
      }
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredDevices(filtered);
    setPage(1); // Reset to first page when filters change
  }, [deviceList, searchValue, statusFilter, rackFilter, powerRangeFilter, sortField, sortDirection]);

  // Pagination
  const paginatedDevices = filteredDevices.slice((page - 1) * perPage, page * perPage);
  const totalItems = filteredDevices.length;

  const clearAllFilters = () => {
    setSearchValue('');
    setStatusFilter([]);
    setRackFilter([]);
    setPowerRangeFilter('');
  };

  const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
    const variants = {
      normal: { color: '#28a745', bg: '#d4edda', text: 'Normal' },
      warning: { color: '#ffc107', bg: '#fff3cd', text: 'Warning' },
      critical: { color: '#dc3545', bg: '#f8d7da', text: 'Critical' }
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} {version}</div>;
  }

  const activeFiltersCount = (statusFilter.length > 0 ? 1 : 0) + 
                           (rackFilter.length > 0 ? 1 : 0) + 
                           (powerRangeFilter ? 1 : 0) +
                           (searchValue ? 1 : 0);

  return (
    <>
      <Helmet>
        <title data-test="device-list-title">{t('Device List')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light" className="page-header">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" className="page-title">
                {t('Device Management')}
              </Title>
              <div style={{ 
                marginTop: '8px',
                fontSize: '1.1rem',
                opacity: 0.9,
                fontWeight: 400
              }}>
                All Devices • Power & Configuration Management
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ fontSize: '14px' }}>Total Devices</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {deviceList.length}
                </div>
              </div>
            </FlexItem>
          </Flex>
        </PageSection>

        <PageSection variant="light" className="page-background">
          {/* Filters and Search Toolbar */}
          <Card className="device-card-enhanced" style={{ marginBottom: '24px' }}>
            <CardBody>
              <Toolbar>
                <ToolbarContent>
                  {/* Search */}
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Search devices, service tags, IP addresses..."
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                      style={{ minWidth: '300px' }}
                    />
                  </ToolbarItem>
                  
                  {/* Status Filter */}
                  <ToolbarItem>
                    <Select
                      aria-label="Status filter"
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef} 
                          onClick={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
                          isExpanded={isStatusSelectOpen}
                        >
                          Status {statusFilter.length > 0 && `(${statusFilter.length})`}
                        </MenuToggle>
                      )}
                      onSelect={(event, selection) => {
                        const selected = selection as string;
                        if (statusFilter.includes(selected)) {
                          setStatusFilter(statusFilter.filter(s => s !== selected));
                        } else {
                          setStatusFilter([...statusFilter, selected]);
                        }
                      }}
                      isOpen={isStatusSelectOpen}
                      onOpenChange={setIsStatusSelectOpen}
                      style={{ minWidth: '120px' }}
                    >
                      <SelectOption value="normal">Normal</SelectOption>
                      <SelectOption value="warning">Warning</SelectOption>
                      <SelectOption value="critical">Critical</SelectOption>
                    </Select>
                  </ToolbarItem>
                  
                  {/* Rack Filter */}
                  <ToolbarItem>
                    <Select
                      aria-label="Rack filter"
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef} 
                          onClick={() => setIsRackSelectOpen(!isRackSelectOpen)}
                          isExpanded={isRackSelectOpen}
                        >
                          Rack {rackFilter.length > 0 && `(${rackFilter.length})`}
                        </MenuToggle>
                      )}
                      onSelect={(event, selection) => {
                        const selected = selection as string;
                        if (rackFilter.includes(selected)) {
                          setRackFilter(rackFilter.filter(r => r !== selected));
                        } else {
                          setRackFilter([...rackFilter, selected]);
                        }
                      }}
                      isOpen={isRackSelectOpen}
                      onOpenChange={setIsRackSelectOpen}
                      style={{ minWidth: '100px' }}
                    >
                      <SelectOption value="rack-1">Rack 1</SelectOption>
                      <SelectOption value="rack-2">Rack 2</SelectOption>
                      <SelectOption value="rack-3">Rack 3</SelectOption>
                      <SelectOption value="rack-4">Rack 4</SelectOption>
                    </Select>
                  </ToolbarItem>
                  
                  {/* Power Range Filter */}
                  <ToolbarItem>
                    <Select
                      aria-label="Power range filter"
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef} 
                          onClick={() => setIsPowerRangeSelectOpen(!isPowerRangeSelectOpen)}
                          isExpanded={isPowerRangeSelectOpen}
                        >
                          {powerRangeFilter ? 
                            `Power: ${powerRangeFilter}` : 
                            'Power Range'
                          }
                        </MenuToggle>
                      )}
                      onSelect={(event, selection) => {
                        setPowerRangeFilter(selection as string);
                        setIsPowerRangeSelectOpen(false);
                      }}
                      isOpen={isPowerRangeSelectOpen}
                      onOpenChange={setIsPowerRangeSelectOpen}
                      style={{ minWidth: '140px' }}
                    >
                      <SelectOption value="">All Power Levels</SelectOption>
                      <SelectOption value="low">Low (&lt; 200W)</SelectOption>
                      <SelectOption value="medium">Medium (200-400W)</SelectOption>
                      <SelectOption value="high">High (&gt; 400W)</SelectOption>
                    </Select>
                  </ToolbarItem>
                  
                  {/* Sort Dropdown */}
                  <ToolbarItem>
                    <Dropdown
                      onSelect={() => setIsSortDropdownOpen(false)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef} 
                          onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                          isExpanded={isSortDropdownOpen}
                        >
                          Sort: {sortField} {sortDirection === 'asc' ? '↑' : '↓'}
                        </MenuToggle>
                      )}
                      isOpen={isSortDropdownOpen}
                      onOpenChange={setIsSortDropdownOpen}
                    >
                    
                      <DropdownItem key="name" onClick={() => handleSort('name')}>
                        Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownItem>
                      <DropdownItem key="watts" onClick={() => handleSort('watts')}>
                        Power {sortField === 'watts' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownItem>
                      <DropdownItem key="btuPerHour" onClick={() => handleSort('btuPerHour')}>
                        Heat {sortField === 'btuPerHour' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownItem>
                      <DropdownItem key="status" onClick={() => handleSort('status')}>
                        Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownItem>
                      <DropdownItem key="rackId" onClick={() => handleSort('rackId')}>
                        Rack {sortField === 'rackId' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </DropdownItem>
                    </Dropdown>
                  </ToolbarItem>
                  
                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <ToolbarItem>
                      <Button variant="link" onClick={clearAllFilters}>
                        Clear all filters ({activeFiltersCount})
                      </Button>
                    </ToolbarItem>
                  )}
                </ToolbarContent>
              </Toolbar>
              
              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#495057' }}>
                    Active Filters:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {searchValue && (
                      <Chip onClick={() => setSearchValue('')}>
                        Search: "{searchValue}"
                      </Chip>
                    )}
                    {statusFilter.length > 0 && (
                      <ChipGroup categoryName="Status">
                        {statusFilter.map(status => (
                          <Chip 
                            key={status} 
                            onClick={() => setStatusFilter(statusFilter.filter(s => s !== status))}
                          >
                            {status}
                          </Chip>
                        ))}
                      </ChipGroup>
                    )}
                    {rackFilter.length > 0 && (
                      <ChipGroup categoryName="Rack">
                        {rackFilter.map(rack => (
                          <Chip 
                            key={rack} 
                            onClick={() => setRackFilter(rackFilter.filter(r => r !== rack))}
                          >
                            {rack}
                          </Chip>
                        ))}
                      </ChipGroup>
                    )}
                    {powerRangeFilter && (
                      <Chip onClick={() => setPowerRangeFilter('')}>
                        Power: {powerRangeFilter}
                      </Chip>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Results Summary */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              Showing {paginatedDevices.length} of {totalItems} devices
              {activeFiltersCount > 0 && ` (filtered from ${deviceList.length} total)`}
            </div>
          </div>

          {/* Device Table */}
          {filteredDevices.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h4" size="lg">
                No Devices Found
              </Title>
              <EmptyStateBody>
                {activeFiltersCount > 0 
                  ? 'No devices match the current filters. Try adjusting your search criteria.'
                  : 'No devices available in the system.'
                }
              </EmptyStateBody>
              {activeFiltersCount > 0 && (
                <Button variant="primary" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              )}
            </EmptyState>
          ) : (
            <>
              <Card className="device-card-enhanced">
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
                            color: '#495057',
                            cursor: 'pointer'
                          }} 
                          onClick={() => handleSort('name')}>
                            Device Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#495057',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSort('rackId')}>
                            Rack {sortField === 'rackId' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                          <th style={{ 
                            padding: '16px',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: '#495057',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSort('watts')}>
                            Power (W) {sortField === 'watts' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                          <th style={{ 
                            padding: '16px',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: '#495057',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSort('btuPerHour')}>
                            Heat (BTU/hr) {sortField === 'btuPerHour' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                          <th style={{ 
                            padding: '16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#495057'
                          }}>
                            Network
                          </th>
                          <th style={{ 
                            padding: '16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#495057',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSort('status')}>
                            Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                          <th style={{ 
                            padding: '16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            color: '#495057'
                          }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDevices.map((device) => (
                          <tr 
                            key={device.id}
                            style={{ 
                              borderBottom: '1px solid #e9ecef',
                              transition: 'background-color 0.2s ease'
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
                                <div>
                                  <div>{device.name}</div>
                                  <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: 400 }}>
                                    {device.ipAddress}
                                  </div>
                                </div>
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
                              textAlign: 'center',
                              fontSize: '12px'
                            }}>
                              <span style={{ 
                                color: device.activeNics > 0 ? '#28a745' : '#6c757d',
                                fontWeight: 600
                              }}>
                                {device.activeNics}/{device.totalNics}
                              </span>
                              <div style={{ color: '#6c757d' }}>NICs</div>
                            </td>
                            <td style={{ 
                              padding: '16px',
                              textAlign: 'center'
                            }}>
                              {getStatusBadge(device.status)}
                            </td>
                            <td style={{ 
                              padding: '16px',
                              textAlign: 'center'
                            }}>
                              <Dropdown
                                onSelect={() => {}}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle ref={toggleRef} variant="plain" onClick={() => {}}>
                                    ⋮
                                  </MenuToggle>
                                )}
                                isOpen={false}
                              >
                                <DropdownItem key="view">View Details</DropdownItem>
                                <DropdownItem key="reboot">Graceful Reboot</DropdownItem>
                                <DropdownItem key="power">Power Management</DropdownItem>
                                <DropdownItem key="network">Network Config</DropdownItem>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>

              {/* Pagination */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  {totalItems} total devices
                </div>
                <Pagination
                  itemCount={totalItems}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                  onPerPageSelect={(_event, newPerPage) => {
                    setPerPage(newPerPage);
                    setPage(1);
                  }}
                  variant={PaginationVariant.bottom}
                  perPageOptions={[
                    { title: '10', value: 10 },
                    { title: '20', value: 20 },
                    { title: '50', value: 50 },
                    { title: '100', value: 100 }
                  ]}
                />
              </div>
            </>
          )}
        </PageSection>
        <BackToTop isAlwaysVisible />
      </Page>
    </>
  );
}