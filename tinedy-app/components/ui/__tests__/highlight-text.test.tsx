import React from 'react';
import { render } from '@testing-library/react';
import { HighlightText } from '../highlight-text';

describe('HighlightText', () => {
  it('should render plain text when no query provided', () => {
    const { container } = render(<HighlightText text="Hello World" query="" />);
    expect(container.textContent).toBe('Hello World');
    expect(container.querySelector('mark')).not.toBeInTheDocument();
  });

  it('should highlight matching text (case-insensitive)', () => {
    const { container } = render(
      <HighlightText text="Hello World" query="hello" />
    );
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.textContent).toBe('Hello');
  });

  it('should highlight multiple matches', () => {
    const { container } = render(
      <HighlightText text="test test test" query="test" />
    );
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(3);
    marks.forEach((mark) => {
      expect(mark.textContent).toBe('test');
    });
  });

  it('should preserve original text casing', () => {
    const { container } = render(
      <HighlightText text="Hello HELLO hello" query="hello" />
    );
    const marks = container.querySelectorAll('mark');
    expect(marks[0].textContent).toBe('Hello');
    expect(marks[1].textContent).toBe('HELLO');
    expect(marks[2].textContent).toBe('hello');
  });

  it('should support Thai Unicode characters', () => {
    const { container } = render(
      <HighlightText text="สมชัย ใจดี" query="สมชัย" />
    );
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.textContent).toBe('สมชัย');
  });

  it('should handle partial matches', () => {
    const { container } = render(
      <HighlightText text="testing" query="test" />
    );
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.textContent).toBe('test');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <HighlightText text="Hello" query="ello" className="custom-class" />
    );
    const span = container.querySelector('span');
    expect(span).toHaveClass('custom-class');
  });

  it('should handle special regex characters safely', () => {
    const { container } = render(
      <HighlightText text="test (hello) world" query="(hello)" />
    );
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.textContent).toBe('(hello)');
  });

  it('should handle empty text', () => {
    const { container } = render(<HighlightText text="" query="test" />);
    expect(container.textContent).toBe('');
  });

  it('should apply correct highlight styles', () => {
    const { container } = render(<HighlightText text="test" query="test" />);
    const mark = container.querySelector('mark');
    expect(mark).toHaveClass('bg-yellow-200');
    expect(mark).toHaveClass('font-medium');
  });

  it('should handle whitespace in query', () => {
    const { container } = render(<HighlightText text="test" query="   " />);
    expect(container.querySelector('mark')).not.toBeInTheDocument();
  });

  it('should handle mixed Thai and English text', () => {
    const { container } = render(
      <HighlightText text="สมชัย Smith" query="smith" />
    );
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.textContent).toBe('Smith');
  });
});
