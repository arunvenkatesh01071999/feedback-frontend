import React from 'react';

const StatusFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'Planned', label: 'Planned' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`btn ${currentFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;